import type { MMKV } from 'react-native-mmkv'
import type { Realm } from 'realm'
import { create } from 'zustand'

type StorageState = {
  mmkv: MMKV | null
  realm: Realm | null
  setMMKV: (newMMKV: MMKV) => void
  setRealm: (newRealm: Realm) => void
}

const useStorageStore = create<StorageState>((set) => ({
  mmkv: null,
  realm: null,
  setMMKV: (newMMKV) => set({ mmkv: newMMKV }),
  setRealm: (newRealm) => set({ realm: newRealm }),
}))

export default useStorageStore
