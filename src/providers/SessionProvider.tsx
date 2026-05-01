import { createSecureStorage } from '@lib/storage'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import { createContext, useContext, useEffect, useState } from 'react'

const SessionContext = createContext<{ token: string; setToken: object; loading: boolean }>({
  token: '',
  setToken: () => {},
  loading: true,
})

export function SessionProvider({ children }) {
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { counter, setUserID } = useTokenTriggerStore()

  const init = async () => {
    try {
      createSecureStorage('user-storage').then(async (storage) => {
        const id = storage.getString('user_id')
        const token = storage.getString('token')
        setToken(token || '')
        if (id) setUserID(parseInt(id, 10))
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    init()
  }, [counter])

  return <SessionContext.Provider value={{ token, setToken, loading }}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)
