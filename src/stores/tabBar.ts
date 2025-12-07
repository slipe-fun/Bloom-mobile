import { create } from "zustand";

type TabBarStore = {
	tabBarHeight: number;
	isSearch: boolean;
	searchValue: string;
	isSearchFocused: boolean;
	setTabBarHeight: (tabBarHeight: number) => void;
	setIsSearch: (isSearch: boolean) => void;
	setSearchValue: (searchValue: string) => void;
	setIsSearchFocused: (isSearchFocused: boolean) => void;
};

const useTabBarStore = create<TabBarStore>(set => ({
	tabBarHeight: 0,
	isSearch: false,
	searchValue: "",
	isSearchFocused: false,
	setTabBarHeight: tabBarHeight => set({ tabBarHeight }),
	setIsSearch: isSearch => set({ isSearch }),
	setSearchValue: searchValue => set({ searchValue }),
	setIsSearchFocused: isSearchFocused => set({ isSearchFocused }),
}));

export default useTabBarStore;
