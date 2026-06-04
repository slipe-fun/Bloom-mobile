import getMyUserRequest from '@api/lib/users/getMyUserRequest'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from '../../providers/SessionProvider'

const UserContext = createContext(null)

export default function UserProvider({ children }) {
  z
  const { token } = useSession()
  const [user, setUser] = useState()

  useEffect(() => {
    ;(async () => {
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
    })()
  }, [token])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
