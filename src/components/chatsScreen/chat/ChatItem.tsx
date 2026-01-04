import Chat from '@components/chatsScreen/chat'
import type { Chat as ChatType, ChatView } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import type React from 'react'
import { useMemo } from 'react'

interface ChatItemProps {
  item: ChatType
  userId: string | number
}

export default function ChatItem({ item, userId }: ChatItemProps): React.JSX.Element {
  const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId

  const recipient = useMemo(() => item.members?.find((member) => member.id !== numericUserId), [item, item.members, numericUserId])

  const lastMessage = useMemo(() => {
    if (!item.last_message) {
      return {
        content: 'Чат создан',
        time: '',
      }
    }

    return {
      content: item.last_message.content || 'Чат создан',
      time: formatSentTime(item.last_message.date),
    }
  }, [item.last_message])

  const chatData = useMemo(
    (): ChatView => ({
      lastMessage,
      recipient,
      id: item.id,
      avatar: '',
      unreadCount: 0,
    }),
    [item.id, lastMessage, recipient],
  )

  return <Chat chat={chatData} />
}
