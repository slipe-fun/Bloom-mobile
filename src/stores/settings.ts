import { create } from 'zustand'

type UseSettingsScreenStore = {
  snapPosition: number
  setSnapPosition: (snapPosition: number) => void
  headerHeight: number
  setHeaderHeight: (headerHeight: number) => void
}

const useSettingsScreenStore = create<UseSettingsScreenStore>((set) => ({
  snapPosition: 0,
  setSnapPosition: (snapPosition) => set({ snapPosition }),
  headerHeight: 0,
  setHeaderHeight: (headerHeight) => set({ headerHeight }),
}))

export default useSettingsScreenStore
