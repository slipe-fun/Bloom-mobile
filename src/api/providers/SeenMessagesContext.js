import getChatFromStorage from '@lib/getChatFromStorage'
import initRealm from '@lib/initRealm'
import decrypt from '@lib/skid/decrypt'
import useStorageStore from '@stores/storage'
import { createContext, useContext, useEffect, useState } from 'react'
import Realm from 'realm'
import { useWebSocket } from './WebSocketContext'

const SeenMessagesContext = createContext(null)

export default function SeenMessagesProvider({ children }) {
  // seen messages var
  const [seenMessages, setSeenMessages] = useState([])
  // websocket context
  const ws = useWebSocket()
  // local realm storage
  const { realm } = useStorageStore()

  useEffect(() => {
    if (ws) {
      // websocket socket listener
      ws.addEventListener('message', async (msg) => {
        // parse socket
        let message
        try {
          message = JSON.parse(msg?.data)
        } catch (error) {
          return
        }

        // if socket type is message_seen
        if (message?.type === 'message_seen') {
          // get seen messages from socket message
          const messages = message?.messages

          // change seen messages status in local storage
          realm.write(() => {
            messages?.forEach((message_id) => {
              const msg = realm.objectForPrimaryKey('Message', message_id)
              if (msg) msg.seen = message?.seen_at
            })
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
