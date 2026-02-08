import addKeysToDump from '@api/lib/keys/addKeysToDump'
import getChatFromStorage from '@lib/getChatFromStorage'
import setChatKeysToStorage from '@lib/setChatKeysToStorage'
import decrypt from '@lib/skid/decrypt'
import generateKeys from '@lib/skid/generateKeys'
import { decrypt as sskDecrypt } from '@lib/skid/serversideKeyEncryption'
import { Q } from '@nozbe/watermelondb'
import useStorageStore from '@stores/storage'
import { createContext, useContext, useEffect, useState } from 'react'
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

  function safeObject(obj) {
    if (!obj) return null

    if (obj._raw) return { ...obj._raw }

    try {
      return JSON.parse(JSON.stringify(obj))
    } catch {
      return obj
    }
  }

  async function decryptMessage(_chat, message) {
    // get chat from mmkv storage
    const chat = await getChatFromStorage(message?.chat_id)

    if (!chat) return

    // get current user chat keys
    const myKeys = chat?.keys?.my
    // get recipient chat keys
    const recipientKeys = chat?.keys?.recipient
    // get general chat key
    const key = chat?.key

    try {
      // if kyber message sent by recipient then decrypt using both key pairs
      // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
      return {
        ...(message?.encapsulated_key
          ? decrypt(message, myKeys, recipientKeys, false)
          : sskDecrypt(message?.ciphertext, message?.nonce, key)),
        chat_id: message?.chat_id,
        id: message?.id,
        seen: message?.seen,
        nonce: message?.nonce,
      }
    } catch (error) {
      // if kyber message sent by user (current session user) decrypt using only his keys
      if (error.message === 'invalid polyval tag') {
        try {
          return {
            ...decrypt(message, myKeys, myKeys, true),
            chat_id: message?.chat_id,
            id: message?.id,
            seen: message?.seen,
            nonce: message?.nonce,
          }
        } catch {}
      }
    }
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
              decryptedLastMessage = await decryptMessage(chat, msg)
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

  useEffect(() => {
    setChats(getChatsFromStorage(mmkv))
  }, [])

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

          // if someone from chat changed keys change them in mmkv storage
          if (message?.type === 'chat.keys_updated') {
            await setChatKeysToStorage(message?.chat_id, {
              kyber_public_key: message?.kyber_public_key,
              ecdh_public_key: message?.ecdh_public_key,
              ed_public_key: message?.ed_public_key,
            })
          } else if (message?.type === 'chat.new') {
            // chat created socket
            // parse chats from mmkv storage
            let _chats
            try {
              _chats = JSON.parse(mmkv.getString('chats'))
            } catch {
              _chats = []
            }

            // generate current user encryption keys
            const myKeys = generateKeys()

            // send current user public keys
            ws.send(
              JSON.stringify({
                type: 'add_keys',
                chat_id: message?.id,
                kyber_public_key: myKeys.kyber_public_key,
                ecdh_public_key: myKeys.ecdh_public_key,
                ed_public_key: myKeys.ed_public_key,
              }),
            )

            // add chat to mmkv storage
            _chats = [
              ..._chats,
              {
                id: message?.id,
                key: message?.encryption_key,
                keys: {
                  my: { ...myKeys },
                  recipient: {},
                },
              },
            ]

            // send dump
            addKeysToDump(mmkv, { chat_id: message?.id, ...myKeys })

            // save changes
            mmkv.set('chats', JSON.stringify(_chats))

            // add new chat to chats var
            setChats((prev) => {
              const next = [...prev, message.chat]
              sort(next).then((sorted) => setChats(sorted))
              return next
            })
          }
        } catch {}
      })
    }
  }, [ws])

  useEffect(() => {
    const subscriptions = []

    chats.forEach((chat) => {
      const collection = database.get('messages')

      const messagesQuery = collection.query(Q.where('chat_id', chat.id), Q.sortBy('date', Q.desc), Q.take(1))

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
  }, [chats])

  return <ChatsContext.Provider value={chats}>{children}</ChatsContext.Provider>
}

export const useChatList = () => useContext(ChatsContext)
