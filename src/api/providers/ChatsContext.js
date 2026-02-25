import addChatToStorage from '@api/lib/chats/addChatToStorage'
import changeChatKey from '@api/lib/keys/changeChatKey'
import getEncryptedKeys from '@api/lib/keys/getEncryptedKeys'
import sendEncryptedKeys from '@api/lib/keys/sendEncryptedKeys'
import getMySession from '@api/lib/sessions/getMySession'
import getMySessions from '@api/lib/sessions/getMySessions'
import getUserSessions from '@api/lib/sessions/getUserSessions'
import getMyUser from '@api/lib/users/getMyUser'
import { Buffer } from '@craftzdog/react-native-buffer'
import getChatFromStorage from '@lib/getChatFromStorage'
import decryptKey from '@lib/skid/decryptKey'
import encryptKey from '@lib/skid/encryptKey'
import base64ToUint8Array from '@lib/skid/modules/utils/base64ToUint8Array'
import { decrypt as sskDecrypt } from '@lib/skid/serversideKeyEncryption'
import { Q } from '@nozbe/watermelondb'
import useStorageStore from '@stores/storage'
import { createContext, useContext, useEffect, useState } from 'react'
import { database } from 'src/db'
import getChatById from '../lib/chats/getChatById'
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

    const key = chat?.key

    try {
      // if kyber message sent by recipient then decrypt using both key pairs
      // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
      return {
        ...sskDecrypt(message?.ciphertext, message?.nonce, key),
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

  function addChat(chat) {
    // add new chat to chats var
    setChats((prev) => {
      const next = [...prev, chat]
      sort(next).then((sorted) => setChats(sorted))
      return next
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
      ;(async () => {
        try {
          const myUser = await getMyUser()
          const mySession = await getMySession()

          const encrypted_keys = await getEncryptedKeys()

          let mySessions = []
          if (encrypted_keys?.find((key) => key?.from_session_id === key?.session_id)) {
            mySessions = await getMySessions()
          }

          for (const key of encrypted_keys) {
            let recipient_session
            if (key?.from_session_id === key?.session_id) {
              recipient_session = mySessions?.find((session) => session?.id === key?.from_session_id)
            } else {
              const chat = await getChatById(key?.chat_id)
              if (!chat) return

              const recipient = chat?.members?.find((member) => member?.id !== myUser?.id)

              const recipient_sessions = await getUserSessions(recipient?.id)
              if (!recipient_sessions) return

              recipient_session = recipient_sessions?.find((session) => session?.id === key?.from_session_id)
            }

            const decrypted = decryptKey({ ...key, ciphertext: key?.encrypted_key, cek_wrap_salt: key?.salt }, mySession, {
              kyber_public_key: recipient_session?.kyber_pub,
              ecdh_public_key: recipient_session?.ecdh_pub,
              edPublicKey: recipient_session?.identity_pub,
            })

            const chatFromStorage = await getChatFromStorage(key?.chat_id)
            if (!chatFromStorage) {
              await addChatToStorage(key?.chat_id)
            }
            await changeChatKey(key?.chat_id, Buffer.from(decrypted).toString('base64'))
          }
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [ws])

  useEffect(() => {
    if (ws?.readyState === WebSocket?.OPEN) {
      ;(async () => {
        try {
          const mySession = await getMySession()
          const myUser = await getMyUser()

          const mySessions = await getMySessions()
          if (!mySessions) return

          const encrypted_keys = await getEncryptedKeys()
          if (!encrypted_keys) return

          const chats = await getChatsFromStorage(mmkv)
          if (!chats) return

          await Promise.all(
            mySessions
              .filter(
                (session) =>
                  session?.identity_pub &&
                  session?.ecdh_pub &&
                  session?.kyber_pub &&
                  !encrypted_keys.find((key) => key?.session_id === session?.id),
              )
              .map((session) =>
                Promise.all(
                  chats.map(async (chat) => {
                    const encrypted = encryptKey(base64ToUint8Array(chat?.key), mySession, {
                      kyber_public_key: session.kyber_pub,
                      ecdh_public_key: session.ecdh_pub,
                      edPublicKey: session.identity_pub,
                    })

                    const key = [
                      {
                        session_id: session.id,
                        encrypted_key: encrypted?.ciphertext,
                        encapsulated_key: encrypted?.encapsulated_key,
                        cek_wrap: encrypted?.cek_wrap,
                        cek_wrap_iv: encrypted?.cek_wrap_iv,
                        salt: encrypted?.cek_wrap_salt,
                        nonce: encrypted?.nonce,
                      },
                    ]

                    return sendEncryptedKeys(chat?.id, myUser?.id, key)
                  }),
                ),
              ),
          )
        } catch (e) {
          console.error(e)
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

          if (message?.type === 'chat.new') {
            await addChatToStorage(message?.id)

            addChat(message)
          } else if (message?.type === 'keys.new') {
            const myUser = await getMyUser()
            const mySession = await getMySession()

            const chat = await getChatById(message?.chat_id)
            if (!chat) return

            const recipient = chat?.members?.find((member) => member?.id !== myUser?.id)

            const recipient_sessions = await getUserSessions(recipient?.id)
            if (!recipient_sessions) return

            const recipient_session = recipient_sessions?.find((session) => session?.id === message?.from_session_id)
            if (!recipient_session) return

            const encrypted_key = message?.keys?.find((key) => key?.session_id === mySession?.id)
            if (!encrypted_key) return

            const decrypted = decryptKey(
              { ...encrypted_key, ciphertext: encrypted_key?.encrypted_key, cek_wrap_salt: encrypted_key?.salt },
              mySession,
              {
                kyber_public_key: recipient_session?.kyber_pub,
                ecdh_public_key: recipient_session?.ecdh_pub,
                edPublicKey: recipient_session?.identity_pub,
              },
            )

            const chatFromStorage = await getChatFromStorage(message?.chat_id)
            if (!chatFromStorage) {
              await addChatToStorage(message?.chat_id)
            }
            await changeChatKey(message?.chat_id, Buffer.from(decrypted).toString('base64'))
          }
        } catch {}
      })
    }
  }, [ws])

  useEffect(() => {
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
  }, [chats])

  return <ChatsContext.Provider value={{ chats, addChat }}>{children}</ChatsContext.Provider>
}

export const useChatList = () => useContext(ChatsContext)
