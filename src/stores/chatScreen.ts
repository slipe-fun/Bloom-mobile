import type { Message } from "@interfaces";
import { create } from "zustand";

type ChatScreenStore= {
    replyMessage: Message | null;
    setReplyMessage: (newFocused: Message) => void
}

const useChatScreenStore = create<ChatScreenStore>((set) => ({
  replyMessage: null,
  setReplyMessage: (newMessage) => set({ replyMessage: newMessage }),
}));

export default useChatScreenStore;
