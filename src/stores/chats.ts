import { create } from "zustand";

type ChatsStore = {
  headerHeight: number;
  setHeaderHeight: (headerHeight: number) => void;
};

const useChatsStore = create<ChatsStore>((set) => ({
  headerHeight: 0,
  setHeaderHeight: (headerHeight) => set({ headerHeight }),
}));

export default useChatsStore;
