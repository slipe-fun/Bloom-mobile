import addSessionKeys from '@api/lib/sessions/addSessionKeys'
import getMySessionRequest from '@api/lib/sessions/getMySessionRequest'
import { useRouter } from 'expo-router'
import { createContext, useContext, useEffect } from 'react'
import { useSession } from '../../providers/SessionProvider'

const UserContext = createContext(null)

export default function UserProvider({ children }) {
  const router = useRouter()
  const { token, setToken } = useSession()

  useEffect(() => {
    ;(async () => {
      if (token !== '') {
        try {
          const session = await getMySessionRequest()

          if (!session?.identity_pub || !session?.kyber_pub || !session?.ecdh_pub) {
            const session_keys = generateKeys()

            await addSessionKeys(session_keys)
          }
        } catch (error) {
          if (error?.response?.status === 401) {
            setToken('')
            router.navigate('/(auth)/Welcome')
          }
        }
      }
    })()
  }, [token])

  return <UserContext.Provider>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
