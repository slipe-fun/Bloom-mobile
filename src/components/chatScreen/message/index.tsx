import type { Message as MessageType } from '@interfaces'
import { Pressable } from 'react-native'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { styles } from './Message.styles'
import MessageBubble from './MessageBubble'
import MessageStatus from './MessageStatus'

type MessageProps = {
  message: MessageType | null
  seen?: boolean
  isGroupEnd?: boolean
  isGroupStart?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Message({ message, seen, isGroupEnd, isGroupStart }: MessageProps) {
  return (
    <AnimatedPressable style={[styles.messageWrapper(message?.isMe, !isGroupEnd && !isGroupStart)]}>
      <MessageBubble message={message} />

      <LayoutAnimationConfig skipEntering skipExiting>
        {isGroupEnd && <MessageStatus message={message} seen={seen} />}
      </LayoutAnimationConfig>
    </AnimatedPressable>
  )
}
