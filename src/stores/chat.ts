import type { Chat } from '@interfaces'
import { create } from 'zustand'

interface ChatStore {
  chat: Chat | undefined
  setChat: (chat: Chat) => void
}

const useChatStore = create<ChatStore>((set) => ({
  chat: undefined,
  setChat: (chat) => set({ chat }),
}))

export default useChatStore
