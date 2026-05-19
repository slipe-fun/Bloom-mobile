import { create } from 'zustand'

interface TabBarStore {
  search: boolean
  searchValue: string
  setSearch: (isSearch: boolean) => void
  setSearchValue: (searchValue: string) => void
}

const useTabBarStore = create<TabBarStore>((set) => ({
  search: false,
  searchValue: '',
  setSearch: (search) => set({ search }),
  setSearchValue: (searchValue) => set({ searchValue }),
}))

export default useTabBarStore
