import type { Message as MessageType } from '@interfaces'
import { Pressable } from 'react-native'
import MessageBubble from './Bubble'
import { styles } from './Message.styles'
import StatusBubble from './StatusBubble'

interface MessageProps {
  message: MessageType | null
  seen: boolean
  marginBottom: number
  shouldAnimate: boolean
}

export default function Message({ message, seen, marginBottom, shouldAnimate }: MessageProps) {
  return (
    <Pressable style={[styles.messageWrapper(message?.isMe, marginBottom)]}>
      {/* {!mountFinished && shouldAnimate && (
        <StatusBubble width={width} height={height} setMountFinished={setMountFinished} isActive={shouldAnimate} />
      )} */}
      <MessageBubble message={message} shouldAnimate={shouldAnimate} />
    </Pressable>
  )
}
