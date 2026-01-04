import { API_URL } from '@constants/api'
import type { SearchUser } from '@interfaces'
import axios from 'axios'
import { useEffect, useState } from 'react'

type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

type useUserSearch = {
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
    setPage(1)
  }, [query])

  useEffect(() => {
    let ignore = false

    if (!query.trim()) {
      setUsers([])
      setStatus('idle')
      return
    }

    setStatus('loading')
    setError(null)

    async function fetchUsers() {
      try {
        const response = await axios.get(`${API_URL}/user/search?q=${query}&offset=${(page - 1) * 12}&limit=12`)

        const data = response?.data ?? []

        setUsers(page === 1 ? data : (prev) => [...prev, ...data])

        setStatus(data.length === 0 && page === 1 ? 'empty' : 'success')
      } catch (err) {
        if (!ignore) {
          setError(err)
          setStatus('error')
        }
      }
    }

    const timeOut = setTimeout(() => {
      fetchUsers()
    }, 600)

    return () => {
      ignore = true
      clearTimeout(timeOut)
    }
  }, [query, page])

  return {
    users,
    status,
    error,
    loadMore: () => setPage((p) => p + 1),
  }
}
