import getReplyToMessageFromStorage from '@api/lib/messages/getReplyToMessageFromStorage'
import getChatFromStorage from '@lib/getChatFromStorage'
import decrypt from '@lib/skid/decrypt'
import { decrypt as sskDecrypt } from '@lib/skid/serversideKeyEncryption'
import { createContext, useContext, useEffect, useState } from 'react'
import { database } from 'src/db'
import { useWebSocket } from './WebSocketContext'

const MessagesContext = createContext(null)

export default function MessagesProvider({ children }) {
  // messages variable
  const [messages, setMessages] = useState([])
  // websocket context
  const ws = useWebSocket()

  useEffect(() => {
    if (ws?.readyState === WebSocket?.OPEN) {
      // websocket socket listener
      ws.addEventListener('message', async (msg) => {
        // parse socket
        let message
        try {
          message = JSON.parse(msg?.data)
        } catch {
          return
        }

        // get chat from mmkv storage
        const chat = await getChatFromStorage(message?.chat_id)

        if (!chat) return

        // get current user chat keys
        const myKeys = chat?.keys?.my
        // get recipient chat keys
        const recipientKeys = chat?.keys?.recipient
        // get general chat key
        const key = chat?.key

        let reply_to
        if (message?.reply_to) {
          try {
            const reply_to_message = getReplyToMessageFromStorage(message?.reply_to?.id)

            if (reply_to_message) {
              reply_to = reply_to_message
            }

            reply_to = message?.encapsulated_key
              ? decrypt(message?.reply_to, myKeys, recipientKeys, false)
              : sskDecrypt(message?.reply_to?.ciphertext, message?.reply_to?.nonce, key)
          } catch {}
        }

        const reply_to_json = reply_to
          ? {
              id: message?.reply_to?.id,
              chat_id: message?.chat_id,
              content: reply_to?.content,
              author_id: reply_to?.author_id || reply_to?.from_id,
              date: reply_to?.date,
              seen: message?.reply_to?.seen,
            }
          : null

        // if socket type is message
        if (message?.type === 'message.new') {
          try {
            //
            // IF SOFT SKID ENCRYPTION TYPE
            //

            if (message?.encryption_type === 'server') {
              // decrypt message by general chat key
              const decrypted = sskDecrypt(message?.ciphertext, message?.nonce, key)

              // add decrypted message to messages var
              setMessages((prev) => [
                ...prev,
                {
                  ...decrypted,
                  chat_id: message?.chat_id,
                  id: message?.id,
                  reply_to: reply_to_json,
                  nonce: message?.nonce,
                  raw: message,
                },
              ])

              // add decrypted message to local storage
              await database.write(async () => {
                await database.get('messages').create((msg) => {
                  msg.serverId = message?.id
                  msg.chatId = message?.chat_id
                  msg.content = decrypted?.content
                  msg.authorId = decrypted?.from_id
                  msg.date = new Date()
                  msg.seen = null
                  msg.nonce = message?.nonce
                  msg.replyToId = reply_to_json?.id
                })
              })

              return
            }

            //
            // IF HEAVY SKID ENCRYPTION TYPE
            //

            // decrypt message by current user and recipient keys
            let decrypted

            try {
              // if kyber message sent by recipient then decrypt using both key pairs
              // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
              decrypted = {
                ...decrypt(message, myKeys, recipientKeys, false),
                chat_id: message?.chat_id,
                id: message?.id,
                reply_to: reply_to_json,
                nonce: message?.nonce,
              }
            } catch (error) {
              // if kyber message sent by user (current session user) decrypt using only his keys
              if (error.message === 'invalid polyval tag') {
                try {
                  decrypted = {
                    ...decrypt(message, myKeys, myKeys, true),
                    chat_id: message?.chat_id,
                    id: message?.id,
                    reply_to: reply_to_json,
                    nonce: message?.nonce,
                  }
                } catch {}
              }
            }

            // add decrypted message to messages var
            setMessages((prev) => [...prev, decrypted])

            // add decrypted message to local storage
            await database.write(async () => {
              await database.get('messages').create((msg) => {
                msg.serverId = message?.id
                msg.chatId = message?.chat_id
                msg.content = decrypted?.content
                msg.authorId = decrypted?.from_id
                msg.date = new Date()
                msg.seen = null
                msg.nonce = message?.nonce
                msg.replyToId = reply_to_json?.id
              })
            })
          } catch {}
        }
      })
    }
  }, [ws])

  // clear messages history
  function clear(chat_id) {
    setMessages((prev) => prev.filter((msg) => msg.chat_id !== chat_id))
  }

  return <MessagesContext.Provider value={{ messages, clear }}>{children}</MessagesContext.Provider>
}

export const useMessagesList = () => useContext(MessagesContext)
