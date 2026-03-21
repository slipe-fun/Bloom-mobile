import addSessionKeys from '@api/lib/sessions/addSessionKeys'
import getMySessionRequest from '@api/lib/sessions/getMySessionRequest'
import getMyUserRequest from '@api/lib/users/getMyUserRequest'
import { useRouter } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from '../../providers/SessionProvider'

const UserContext = createContext(null)

export default function UserProvider({ children }) {
  const router = useRouter()
  const { token, setToken } = useSession()
  const [user, setUser] = useState()

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

  useEffect(() => {
    ;async () => {
      if (token !== '') {
        try {
          const user = await getMyUserRequest()
          if (user) {
            setUser(user)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }, [token])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
