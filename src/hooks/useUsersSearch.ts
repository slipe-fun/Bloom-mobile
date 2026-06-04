import type { SearchStatus } from '@components/chats/search/Empty'
import { API_URL } from '@constants/api'
import type { SearchUser } from '@interfaces'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'

export default function useUsersSearch(query: string = '') {
  const [q, setQ] = useState(query)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: ['users-search', q],
    queryFn: async ({ pageParam, signal }) => {
      const res = await axios.get<SearchUser[]>(`${API_URL}/user/search`, {
        params: { q, offset: pageParam, limit: 12 },
        signal,
      })
      return res.data ?? []
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 12 ? allPages.length * 12 : undefined),
    enabled: !!q,
  })

  const users = useMemo(() => data?.pages.flat() ?? [], [data])

  let status: SearchStatus = 'success'
  if (!q) status = 'emptyHistory'
  else if (isLoading) status = 'loading'
  else if (isError) status = 'notFound'
  else if (users.length === 0) status = 'notFound'

  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed === q) return

    if (!trimmed) {
      setQ('')
      return
    }

    if (!q) {
      setQ(trimmed)
      return
    }

    const t = setTimeout(() => setQ(trimmed), 400)
    return () => clearTimeout(t)
  }, [query])

  return {
    users,
    status,
    loadMore: () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    },
  }
}
