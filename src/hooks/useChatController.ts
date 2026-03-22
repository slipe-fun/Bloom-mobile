import useMessages from '@api/hooks/encryption/useMessages'
import type { Chat as ChatType, Message } from '@interfaces'
import type { FlashListRef } from '@shopify/flash-list'
import { useEffect, useMemo, useState } from 'react'

interface useChatControllerProps {
  chat: string
  listRef: FlashListRef<Message>
}

interface useChatController {
  _chat: ChatType
  nextPage: () => void
  seenID: number
  addMessage: () => void
  messages: Message[]
}

export default function useChatController({ chat, listRef }: useChatControllerProps): useChatController {
  const _chat = JSON.parse(chat) as ChatType

  const { messages, addMessage, nextPage } = useMessages(_chat?.id)
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
    listRef?.scrollToEnd({ animated: true })
  }, [messages, listRef])

  return { messages: computedMessages, addMessage, seenID, nextPage, _chat }
}
