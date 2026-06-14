import addChatToStorage from '@api/lib/chats/addChatToStorage'
import createChat from '@api/lib/chats/create'
import getChatFromStorage from '@api/lib/chats/getChatFromStorage'
import prepareForHanshake from '@api/lib/handshake/prepare'
import getSkid from '@constants/skid'
import { restoreBytes } from '@lib/skid-v3/src/utils'
import { Q } from '@nozbe/watermelondb'
import useChatStore from '@stores/chat'
import useStorageStore from '@stores/storage'
import { useRouter } from 'expo-router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { database } from 'src/db'
import getChats from '../lib/chats/getChats'
import getChatsFromStorage from '../lib/chats/getChatsFromStorage'
import { useWebSocket } from './WebSocketContext'

const ChatsContext = createContext(null)

export default function ChatsProvider({ children }) {
  // chats variable
  const [chats, setChats] = useState([])
  // websocket context
  const ws = useWebSocket()
  // storages
  const { mmkv } = useStorageStore()

  const { push } = useRouter()
  const setChat = useChatStore((state) => state.setChat)

  function safeObject(obj) {
    if (!obj) return null

    if (obj._raw) return { ...obj._raw }

    try {
      return JSON.parse(JSON.stringify(obj))
    } catch {
      return obj
    }
  }

  async function decryptMessage(message) {
    const skid = await getSkid()
    // get chat from mmkv storage
    const chat = await getChatFromStorage(message?.chat_id)
    if (!chat) return

    const key = chat?.key

    try {
      // if kyber message sent by recipient then decrypt using both key pairs
      // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
      return {
        ...(await skid.message.decrypt(Buffer.from(key, 'hex'), restoreBytes(message), chat?.me?.id, chat?.recipient?.id)),
        chat_id: message?.chat_id,
        id: message?.id,
        seen: message?.seen,
        nonce: message?.nonce,
      }
    } catch {}
  }

  async function sort(chats) {
    const collection = await database.get('messages')
    const enrichedChats = await Promise.all(
      chats?.map(async (chat) => {
        const results = await collection.query(Q.where('chat_id', chat?.id ?? 0), Q.sortBy('date', Q.desc)).fetch()

        const firstMessage = results[0]

        const localLastMessage = firstMessage ? safeObject(firstMessage) : null

        let decryptedLastMessage = null
        const msg = chat?.last_message

        const isEncrypted = msg && (msg.ciphertext || msg.encapsulated_key)

        if (msg) {
          if (isEncrypted) {
            try {
              decryptedLastMessage = await decryptMessage(msg)
            } catch (e) {
              console.warn('Decryption failed', e)
            }
          } else {
            decryptedLastMessage = msg
          }
        }

        const localTime = localLastMessage?.date ? new Date(localLastMessage.date).getTime() : 0
        const remoteTime = decryptedLastMessage?.date ? new Date(decryptedLastMessage.date).getTime() : 0

        let finalLastMessage

        if (localTime === 0 && remoteTime === 0) {
          finalLastMessage = null
        } else if (localTime >= remoteTime) {
          finalLastMessage = localLastMessage
        } else {
          finalLastMessage = decryptedLastMessage
        }

        return {
          ...chat,
          last_message: finalLastMessage,
        }
      }),
    )

    return enrichedChats.sort((a, b) => {
      const dateA = a.last_message?.date ? new Date(a.last_message.date) : 0
      const dateB = b.last_message?.date ? new Date(b.last_message.date) : 0
      return dateB - dateA
    })
  }

  function addChat(chat) {
    // add new chat to chats var
    setChats((prev) => {
      const next = [...prev, chat]
      sort(next).then((sorted) => setChats(sorted))
      return next
    })
  }

  useEffect(() => {
    if (!mmkv) {
      return
    }

    setChats(getChatsFromStorage(mmkv))
  }, [mmkv])

  useEffect(() => {
    if (ws?.readyState === WebSocket?.OPEN) {
      ;(async () => {
        try {
          // get chats from api
          const _chats = await getChats(ws)
          if (_chats) setChats(await sort(_chats))
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [ws])

  useEffect(() => {
    if (ws?.readyState === WebSocket?.OPEN) {
      ;(async () => {
        const lastReadMessages = chats?.map((chat) => chat?.last_read_message).filter(Boolean)

        if (lastReadMessages?.length > 0) {
          await database.write(async () => {
            const collection = database.get('messages')

            for (const message of lastReadMessages) {
              const existing = await collection.query(Q.where('server_id', message?.id)).fetch()

              if (existing[0]) {
                await existing[0].update((m) => {
                  m.seen = new Date(message?.seen)
                })
              } else {
                const decryptedMessage = decryptMessage(message)

                await collection.create((m) => {
                  m.serverId = decryptedMessage?.id
                  m.chatId = decryptedMessage.chat_id
                  m.content = decryptedMessage.content
                  m.authorId = decryptedMessage.author_id
                  m.date = new Date(decryptedMessage.date)
                  m.seen = new Date(message?.seen)
                  m.nonce = decryptedMessage.nonce
                  m.replyToId = decryptedMessage?.reply_to?.id
                })
              }
            }
          })
        }
      })()
    }
  }, [chats, ws])

  useEffect(() => {
    if (ws?.readyState === WebSocket?.OPEN) {
      // websocket message listener
      ws.addEventListener('message', async (msg) => {
        try {
          // parse socket message
          let message
          try {
            message = JSON.parse(msg?.data)
          } catch {
            return
          }

          if (message?.type === 'chat.new') {
            const skid = await getSkid()

            const { type, user_id, ...chat } = message
            const recipient = chat?.members?.find((member) => member?.id !== user_id)

            const { sender_keys, recipient_keys } = await prepareForHanshake(mmkv, recipient)

            const chat_key = await skid.handshake.finalize(restoreBytes(chat?.handshake), recipient_keys, sender_keys, false)

            await addChatToStorage(chat, Buffer.from(chat_key).toString('hex'))
            addChat({ ...chat, key: Buffer.from(chat_key).toString('hex') })
          }
        } catch {}
      })
    }
  }, [ws])

  useEffect(() => {
    if (chats) {
      const subscriptions = []

      chats.forEach((chat) => {
        const collection = database.get('messages')

        const messagesQuery = collection.query(Q.where('chat_id', chat?.id || null), Q.sortBy('date', Q.desc), Q.take(1))

        const subscription = messagesQuery.observe().subscribe((messages) => {
          if (messages.length > 0) {
            const latestMessage = safeObject(messages[0])

            setChats((prev) => {
              const existingChat = prev.find((c) => c.id === chat.id)
              if (existingChat?.last_message?.id === latestMessage.id) {
                return prev
              }

              const updated = prev.map((c) => (c.id === chat.id ? { ...c, last_message: latestMessage } : c))

              return [...updated].sort((a, b) => {
                const dateA = a.last_message?.date ? new Date(a.last_message.date).getTime() : 0
                const dateB = b.last_message?.date ? new Date(b.last_message.date).getTime() : 0
                return dateB - dateA
              })
            })
          }
        })

        subscriptions.push(subscription)
      })

      return () => {
        subscriptions.map((s) => s.unsubscribe())
      }
    }
  }, [chats])

  const actions = useMemo(
    () => ({
      openOrCreateChat: async (user) => {
        const chat = chats.find((c) => c?.recipient?.id === user?.id)
        if (chat) {
          setChat(chat)
          push(`/(app)/chat/${chat.id}`)
          return
        }

        const createdChat = await createChat(user)
        addChat(createdChat)
        setChat(createdChat)
        push(`/(app)/chat/${createdChat?.id}`)
      },
    }),
    [chats],
  )

  return <ChatsContext.Provider value={{ chats, addChat, actions }}>{children}</ChatsContext.Provider>
}

export const useChatList = () => useContext(ChatsContext)
