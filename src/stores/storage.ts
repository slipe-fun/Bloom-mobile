import { createSecureStorage } from '@lib/storage'
import type { MMKV } from 'react-native-mmkv'
import { create } from 'zustand'

type StorageState = {
  mmkv: MMKV | null
  setMMKV: (newMMKV: MMKV) => void
  ensureMMKV: () => Promise<MMKV>
}

let mmkvPromise: Promise<MMKV> | null = null

const useStorageStore = create<StorageState>((set) => ({
  mmkv: null,
  setMMKV: (newMMKV) => set({ mmkv: newMMKV }),
  ensureMMKV: async () => {
    const currentStorage = useStorageStore.getState().mmkv

    if (currentStorage) {
      return currentStorage
    }

    if (!mmkvPromise) {
      mmkvPromise = createSecureStorage('user-storage')
        .then((storage) => {
          set({ mmkv: storage })
          return storage
        })
        .finally(() => {
          mmkvPromise = null
        })
    }

    return mmkvPromise
  },
}))

export default useStorageStore
