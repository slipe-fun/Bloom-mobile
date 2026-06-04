import { createStorage } from '@lib/storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'

export const storage = createStorage('app-query-cache')

const clientStorage = {
  setItem: async (key: string, value: string): Promise<void> => storage.set(key, value),
  getItem: async (key: string): Promise<string | null> => {
    const value = storage.getString(key)
    return value === undefined ? null : value
  },
  // @ts-expect-error
  removeItem: async (key: string): Promise<void> => storage.remove(key),
}

export const clientPersister = createAsyncStoragePersister({
  storage: clientStorage,
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  },
})
