import getMyUserRequest from '@api/lib/users/getMyUserRequest'
import type { User } from '@interfaces'
import { createSecureStorage } from '@lib/storage'
import { useEffect, useState } from 'react'

interface useMe {
  loading: boolean
  error: string
  user: User | undefined
}

export default function useMe(): useMe {
  // variables
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    let canceled = false

    const fetchUser = async () => {
      try {
        // mmkv storage
        const Storage = await createSecureStorage('user-storage')

        // send get user info request
        const response = await getMyUserRequest()

        if (!canceled) {
          setUser(response)
          Storage.set('user', JSON.stringify(response))
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    return () => {
      canceled = true
    }
  }, [])

  return { loading, error, user }
}
