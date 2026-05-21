import type { SearchStatus } from '@components/chats/search/Empty'
import { API_URL } from '@constants/api'
import type { SearchUser } from '@interfaces'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface useUserSearch {
  users: SearchUser[]
  status: SearchStatus
  error: string
  loadMore: () => void
}

export default function useUsersSearch(query: string = ''): useUserSearch {
  const [status, setStatus] = useState<SearchStatus>('emptyHistory')
  const [users, setUsers] = useState<SearchUser[]>([])
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let ignore = false

    if (!query.trim()) {
      setUsers((prev) => (prev.length ? [] : prev))
      setStatus((prev) => (prev !== 'emptyHistory' ? 'emptyHistory' : prev))
      return
    }

    if (page === 1 && users.length === 0) setStatus('loading')

    async function fetchUsers() {
      try {
        const response = await axios.get(`${API_URL}/user/search?q=${query}&offset=${(page - 1) * 12}&limit=12`)

        if (ignore) return

        const data = response?.data ?? []

        setUsers((prev) => (page === 1 ? data : [...prev, ...data]))
        setStatus(data.length === 0 && page === 1 ? 'notFound' : 'success')
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || 'Error')
          setStatus('notFound')
        }
      }
    }

    const timeOut = setTimeout(fetchUsers, 600)

    return () => {
      ignore = true
      clearTimeout(timeOut)
    }
  }, [query, page])

  useEffect(() => {
    setPage((prev) => (prev !== 1 ? 1 : prev))
  }, [query])

  return {
    users,
    status,
    error,
    loadMore: () => {
      if (status !== 'loading' && status !== 'notFound') {
        setPage((p) => p + 1)
      }
    },
  }
}
