import { MessageInterface } from "@interfaces";
import { create } from "zustand";

type ChatScreenStore= {
    replyMessage: MessageInterface | null;
    setReplyMessage: (newFocused: MessageInterface) => void
}

const useChatScreenStore = create<ChatScreenStore>((set) => ({
  replyMessage: null,
  setReplyMessage: (newMessage) => set({ replyMessage: newMessage }),
}));

export default useChatScreenStore;
