import { create } from 'zustand'

interface FooterStore {
  search: boolean
  searchValue: string
  setSearch: (isSearch: boolean) => void
  setSearchValue: (searchValue: string) => void
}

const useFooterStore = create<FooterStore>((set) => ({
  search: false,
  searchValue: '',
  setSearch: (search) => set({ search }),
  setSearchValue: (searchValue) => set({ searchValue }),
}))

export default useFooterStore
