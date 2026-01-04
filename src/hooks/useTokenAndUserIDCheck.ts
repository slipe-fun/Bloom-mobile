import { createSecureStorage } from '@lib/storage'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import { useEffect, useState } from 'react'

export default function useTokenCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { counter, setUserID } = useTokenTriggerStore()

  const init = async () => {
    try {
      createSecureStorage('user-storage').then(async (storage) => {
        const id = storage.getString('user_id')
        const token = storage.getString('token')
        setIsAuthenticated(!!token)
        if (id) setUserID(parseInt(id))
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    init()
  }, [counter])

  return { isAuthenticated, isLoading }
}
