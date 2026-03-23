import type { Message } from '@interfaces'
import { create } from 'zustand'

type ChatScreenStore = {
  replyMessage: Message['id'] | null
  setReplyMessage: (replyMessage: Message['id']) => void
}

const useChatStore = create<ChatScreenStore>((set) => ({
  replyMessage: null,
  setReplyMessage: (replyMessage) => set({ replyMessage }),
}))

export default useChatStore
