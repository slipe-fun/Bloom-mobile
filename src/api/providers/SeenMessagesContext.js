import { Q } from '@nozbe/watermelondb'
import { createContext, useContext, useEffect, useState } from 'react'
import { database } from 'src/db'
import { useWebSocket } from './WebSocketContext'

const SeenMessagesContext = createContext(null)

export default function SeenMessagesProvider({ children }) {
  // seen messages var
  const [seenMessages, setSeenMessages] = useState([])
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

        // if socket type is message_seen
        if (message?.type === 'message.seen') {
          // get seen messages from socket message
          const messages = message?.messages

          // change seen messages status in local storage
          await database.write(async () => {
            const collection = await database.get('messages')

            const msgs = await collection.query(Q.where('id', Q.oneOf(messages.map(String)))).fetch()

            for (const message of msgs ?? []) {
              await message.update((m) => {
                m.seen = message?.seen_at
              })
            }
          })

          // add seen messages to seen messages var
          setSeenMessages(
            messages?.map((_message) => ({
              id: _message,
              date: message?.seen_at,
              chat_id: message?.chat_id,
            })),
          )
        }
      })
    }
  }, [ws])

  // clear seen messages
  function clear(chat_id) {
    setSeenMessages((prev) => prev.filter((msg) => msg.chat_id !== chat_id))
  }

  return <SeenMessagesContext.Provider value={{ seenMessages, clear }}>{children}</SeenMessagesContext.Provider>
}

export const useSeenMessagesList = () => useContext(SeenMessagesContext)
