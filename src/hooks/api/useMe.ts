import { API_URL } from '@constants/api'
import type { User } from '@interfaces'
import { createSecureStorage } from '@lib/storage'
import axios from 'axios'
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
        // get user token from mmkv storage
        const token = Storage.getString('token')

        // send get user info request
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!canceled) {
          setUser(response?.data)
          Storage.set('user', JSON.stringify(response?.data))
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
