import { ROUTES } from '@constants/routes'
import type { TabValue } from '@interfaces'
import { create } from 'zustand'

type TabBarStore = {
  tabBarHeight: number
  isSearch: boolean
  searchValue: string
  isSearchFocused: boolean
  activeTab: TabValue
  setTabBarHeight: (tabBarHeight: number) => void
  setIsSearch: (isSearch: boolean) => void
  setSearchValue: (searchValue: string) => void
  setIsSearchFocused: (isSearchFocused: boolean) => void
  setActiveTab: (activeTab: TabValue) => void
}

const useTabBarStore = create<TabBarStore>((set) => ({
  tabBarHeight: 0,
  isSearch: false,
  searchValue: '',
  isSearchFocused: false,
  activeTab: ROUTES.tabs.chats,
  setTabBarHeight: (tabBarHeight) => set({ tabBarHeight }),
  setIsSearch: (isSearch) => set({ isSearch }),
  setSearchValue: (searchValue) => set({ searchValue }),
  setIsSearchFocused: (isSearchFocused) => set({ isSearchFocused }),
  setActiveTab: (activeTab) => set({ activeTab }),
}))

export default useTabBarStore
