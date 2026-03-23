import type { Message } from '@interfaces'
import { create } from 'zustand'

type ChatScreenStore = {
  replyMessage: Message | null
  setReplyMessage: (replyMessage: Message) => void
}

const useChatScreenStore = create<ChatScreenStore>((set) => ({
  replyMessage: null,
  setReplyMessage: (replyMessage) => set({ replyMessage }),
}))

export default useChatScreenStore
