import type { Chat } from '@interfaces'
import { create } from 'zustand'

interface ChatStore {
  chat: Chat | undefined
  footerHeight: number
  setChat: (chat: Chat) => void
  setFooterHeight: (footerHeight: number) => void
}

const useChatStore = create<ChatStore>((set) => ({
  chat: undefined,
  setChat: (chat) => set({ chat }),
  footerHeight: 0,
  setFooterHeight: (footerHeight) => set({ footerHeight }),
}))

export default useChatStore
