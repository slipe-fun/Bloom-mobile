import useMessages from '@api/hooks/encryption/useMessages'
import type { Chat as ChatType } from '@interfaces'
import { useEffect, useMemo, useState } from 'react'

export default function useChatController(chat) {
  const _chat = JSON.parse(chat) as ChatType

  const { messages, addMessage, nextPage } = useMessages(_chat?.id)
  const [seenID, setSeenID] = useState<number>(0)

  const CHAT_TIME_WINDOW = 5 * 60 * 1000

  const computedMessages = useMemo(() => {
    return messages.reverse().map((item, index) => {
      const prev = messages[index - 1]
      const next = messages[index + 1]

      const groupStart =
        !prev || prev.author_id !== item.author_id || new Date(item.date).getTime() - new Date(prev.date).getTime() > CHAT_TIME_WINDOW

      const groupEnd =
        !next || next.author_id !== item.author_id || new Date(next.date).getTime() - new Date(item.date).getTime() > CHAT_TIME_WINDOW

      return {
        ...item,
        groupStart,
        groupEnd,
      }
    })
  }, [messages])

  useEffect(() => {
    let lastSeen = 0
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m?.seen && m?.isMe) {
        lastSeen = m.id
        break
      }
    }
    setSeenID(lastSeen)
  }, [messages.length, messages])

  return { messages: computedMessages, addMessage, seenID, nextPage, _chat }
}
