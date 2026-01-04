import { WEBSOCKET_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
  // socket var
  const [socket, setSocket] = useState(null)
  // reconnect timeout ref
  const reconnectTimeout = useRef(null)
  // react native app state ref
  const appState = useRef(AppState.currentState)

  // websocket connect function
  const connect = async () => {
    // mmkv storage init
    const storage = await createSecureStorage('user-storage')
    // create websocket connection using current user token got from mmkv storage
    const ws = new WebSocket(WEBSOCKET_URL + storage.getString('token'))

    // if ws connected clear reconnect timeout ref
    ws.onopen = () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
        reconnectTimeout.current = null
      }
    }

    // if ws closed set timeout ref
    ws.onclose = () => {
      if (!reconnectTimeout.current) reconnectTimeout.current = setTimeout(connect, 3000)
    }

    setSocket(ws)
  }

  useEffect(() => {
    // connect websocket
    connect()

    // app state listener
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
        // if app closed then close socket connection
        if (socket) socket.close()
      } else if (appState.current.match(/inactive|background/) && nextState === 'active') {
        // if app opened then open socket connection
        connect()
      }
      // set new app state
      appState.current = nextState
    })

    // cleanup function
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
      if (socket) socket.close()
      subscription.remove()
    }
  }, [])

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
}

export const useWebSocket = () => useContext(WebSocketContext)
