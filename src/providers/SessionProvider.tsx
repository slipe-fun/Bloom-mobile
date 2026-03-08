import getMyUserRequest from '@api/lib/users/getMyUserRequest'
import { createSecureStorage } from '@lib/storage'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import { useRouter } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'

const SessionContext = createContext<{ token: string }>({ token: '' })

export function SessionProvider({ children }) {
  const router = useRouter()
  const [token, setToken] = useState<string>('')
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
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (token !== '') {
        try {
          await getMyUserRequest()
        } catch (error) {
          if (error?.response?.status === 401) {
            setToken('')
            router.navigate('/(auth)/Welcome')
          }
        }
      }
    })()
  }, [token])

  useEffect(() => {
    init()
  }, [counter])

  return <SessionContext.Provider value={{ token }}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)
