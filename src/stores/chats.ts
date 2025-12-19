import { create } from "zustand";

type ChatsStore = {
  headerHeight: number;
  edit: boolean;
  selectedChats: number[];
  setHeaderHeight: (headerHeight: number) => void;
  setEdit: (edit: boolean) => void;
  toggleChat: (id: number) => void;
  clearSelectedChats: () => void;
};

const useChatsStore = create<ChatsStore>((set) => ({
  headerHeight: 0,
  edit: false,
  selectedChats: [],
  setHeaderHeight: (headerHeight) => set({ headerHeight }),
  setEdit: (edit) => set({ edit }),
  toggleChat: (id) =>
    set((state) => ({
      selectedChats: state.selectedChats.includes(id)
        ? state.selectedChats.filter((item) => item !== id)
        : [...state.selectedChats, id],
    })),
    clearSelectedChats: () => set({ selectedChats: []})
}));

export default useChatsStore;
