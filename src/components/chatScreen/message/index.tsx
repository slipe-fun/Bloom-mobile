import { getFadeIn } from '@constants/animations'
import type { Message as MessageType } from '@interfaces'
import type React from 'react'
import { Pressable } from 'react-native'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { styles } from './Message.styles'
import MessageBubble from './MessageBubble'
import MessageStatus from './MessageStatus'

type MessageProps = {
  message: MessageType | null
  seen?: boolean
  prevItem?: MessageType
  nextItem?: MessageType
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Message({ message, seen, prevItem, nextItem }: MessageProps): React.JSX.Element {
  const CHAT_TIME_WINDOW = 5 * 60 * 1000

  const isGroupStart =
    !prevItem ||
    prevItem.author_id !== message.author_id ||
    new Date(message.date).getTime() - new Date(prevItem.date).getTime() > CHAT_TIME_WINDOW

  const isGroupEnd =
    !nextItem ||
    nextItem.author_id !== message.author_id ||
    new Date(nextItem.date).getTime() - new Date(message.date).getTime() > CHAT_TIME_WINDOW

  return (
    <AnimatedPressable entering={getFadeIn()} style={[styles.messageWrapper(message?.isMe, !isGroupStart && !isGroupEnd)]}>
      <MessageBubble message={message} />

      <LayoutAnimationConfig skipEntering skipExiting>
        {isGroupEnd && <MessageStatus message={message} seen={seen} />}
      </LayoutAnimationConfig>
    </AnimatedPressable>
  )
}
