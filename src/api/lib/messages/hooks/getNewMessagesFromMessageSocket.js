import filterMessagesByChatId from '../filterMessagesByChatId'

export default function (mmkv, setMessages, newMessages, chat_id, messages, clearNewMessages) {
  try {
    if (!newMessages?.length) return

    // filter messages by current chat_id
    const filtered = filterMessagesByChatId(mmkv, chat_id, newMessages)

    if (filtered.length > 0) {
      const newFilteredMessages = filtered.map((newMessage) => {
        const isMessageAlreadyExists = messages.find((message) => message?.nonce === newMessage?.nonce)

        if (isMessageAlreadyExists) {
          return { ...isMessageAlreadyExists, ...newMessage, isSending: false, nonce: newMessage?.nonce }
        }

        return { ...newMessage, nonce: newMessage?.nonce }
      })

      setMessages((prev) => [...prev, ...newFilteredMessages])
    }

    // clear context messages history
    clearNewMessages(chat_id)
  } catch {}
}
