import type { Message as MessageType } from '@interfaces'
import { Pressable } from 'react-native'
import { styles } from './Message.styles'
import MessageBubble from './MessageBubble'

interface MessageProps {
  message: MessageType | null
  seen: boolean
  marginBottom: number
}

export default function Message({ message, seen, marginBottom }: MessageProps) {
  return (
    <Pressable style={[styles.messageWrapper(message?.isMe, marginBottom)]}>
      <MessageBubble message={message} />
    </Pressable>
  )
}
