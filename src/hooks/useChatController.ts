import useMessages from '@api/hooks/encryption/useMessages'
import type { Chat, Message } from '@interfaces'
import { useEffect, useMemo, useState } from 'react'

interface useChatControllerProps {
  chat: Chat
}

interface useChatController {
  nextPage: () => void
  seenID: number
  addMessage: (content: string, reply_to?: number) => Promise<void>
  messages: Message[]
}

export default function useChatController({ chat }: useChatControllerProps): useChatController {
  const { messages, addMessage, nextPage } = useMessages(chat?.id)
  const [seenID, setSeenID] = useState<number>(0)

  const CHAT_TIME_WINDOW = 5 * 60 * 1000

  const computedMessages = useMemo(() => {
    return [...messages].reverse().map((item, index) => {
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
    let lastSeenId = 0
    let lastSeenTime = 0

    messages.forEach((m) => {
      if (m?.seen) {
        const t = new Date(m.seen).getTime()
        if (t > lastSeenTime) {
          lastSeenTime = t
          lastSeenId = m.id
        }
      }
    })

    setSeenID(lastSeenId)
  }, [messages])

  return { messages: computedMessages, addMessage, seenID, nextPage }
}
