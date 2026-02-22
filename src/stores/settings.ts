import { create } from 'zustand'

type UseSettingsScreenStore = {
  snapEndPosition: number
  setSnapEndPosition: (snapEndPosition: number) => void
  headerHeight: number
  setHeaderHeight: (headerHeight: number) => void
}

const useSettingsScreenStore = create<UseSettingsScreenStore>((set) => ({
  snapEndPosition: 0,
  setSnapEndPosition: (snapEndPosition) => set({ snapEndPosition }),
  headerHeight: 0,
  setHeaderHeight: (headerHeight) => set({ headerHeight }),
}))

export default useSettingsScreenStore
