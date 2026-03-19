import { create } from 'zustand'

interface TabBarStore {
  height: number
  width: number
  search: boolean
  searchValue: string
  searchFocused: boolean
  setHeight: (tabBarHeight: number) => void
  setWidth: (tabBarWidth: number) => void
  setSearch: (isSearch: boolean) => void
  setSearchValue: (searchValue: string) => void
  setSearchFocused: (isSearchFocused: boolean) => void
}

const useTabBarStore = create<TabBarStore>((set) => ({
  height: 0,
  width: 0,
  search: false,
  searchValue: '',
  searchFocused: false,
  setHeight: (height) => set({ height }),
  setWidth: (width) => set({ width }),
  setSearch: (search) => set({ search }),
  setSearchValue: (searchValue) => set({ searchValue }),
  setSearchFocused: (searchFocused) => set({ searchFocused }),
}))

export default useTabBarStore
