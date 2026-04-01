import { create } from 'zustand'

type ChatsStore = {
  edit: boolean
  selectedChats: number[]
  setEdit: (edit: boolean) => void
  toggleChat: (id: number) => void
  clearSelectedChats: () => void
}

const useChatsStore = create<ChatsStore>((set) => ({
  edit: false,
  selectedChats: [],
  setEdit: (edit) => set({ edit }),
  toggleChat: (id) =>
    set((state) => ({
      selectedChats: state.selectedChats.includes(id) ? state.selectedChats.filter((item) => item !== id) : [...state.selectedChats, id],
    })),
  clearSelectedChats: () => set({ selectedChats: [] }),
}))

export default useChatsStore
