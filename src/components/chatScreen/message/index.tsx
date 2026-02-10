import type { Message as MessageType } from '@interfaces'
import { Pressable } from 'react-native'
import MessageBubble from './Bubble'
import { styles } from './Message.styles'

interface MessageProps {
  message: MessageType | null
  seen: boolean
  marginBottom: number
}

export default function Message({ message, seen, marginBottom }: MessageProps) {
  return (
    <Pressable style={[styles.messageWrapper(message?.isMe, marginBottom)]}>
      <MessageBubble message={message} seen={seen} />
    </Pressable>
  )
}
