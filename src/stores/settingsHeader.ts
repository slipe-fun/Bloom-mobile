import { create } from 'zustand'

interface UseSettingsHeaderStore {
  snapPosition: number
  setSnapPosition: (snapPosition: number) => void
  headerHeight: number
  setHeaderHeight: (headerHeight: number) => void
}

export const useSettingsHeaderStore = create<UseSettingsHeaderStore>((set) => ({
  snapPosition: 0,
  setSnapPosition: (snapPosition) => set({ snapPosition }),
  headerHeight: 0,
  setHeaderHeight: (headerHeight) => set({ headerHeight }),
}))
