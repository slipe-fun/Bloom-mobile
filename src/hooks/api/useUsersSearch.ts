import { API_URL } from '@constants/api'
import type { SearchUser } from '@interfaces'
import axios from 'axios'
import { useEffect, useState } from 'react'

type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

interface useUserSearch {
  users: SearchUser[]
  status: SearchStatus
  error: string
  loadMore: () => void
}

export default function useUsersSearch(query: string = ''): useUserSearch {
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [users, setUsers] = useState<SearchUser[]>([])
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let ignore = false

    if (!query.trim()) {
      setUsers((prev) => (prev.length ? [] : prev))
      setStatus((prev) => (prev !== 'idle' ? 'idle' : prev))
      return
    }

    if (page === 1) setStatus('loading')

    async function fetchUsers() {
      try {
        const response = await axios.get(`${API_URL}/user/search?q=${query}&offset=${(page - 1) * 12}&limit=12`)

        if (ignore) return

        const data = response?.data ?? []

        setUsers((prev) => (page === 1 ? data : [...prev, ...data]))
        setStatus(data.length === 0 && page === 1 ? 'empty' : 'success')
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || 'Error')
          setStatus('error')
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
      if (status !== 'loading' && status !== 'empty') {
        setPage((p) => p + 1)
      }
    },
  }
}
