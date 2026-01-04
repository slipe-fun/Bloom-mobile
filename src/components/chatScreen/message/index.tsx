import { getFadeIn } from '@constants/animations'
import { useMessageSwipe } from '@hooks'
import type { Message } from '@interfaces'
import type React from 'react'
import { Pressable, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import MessageActions from './actions'
import { styles } from './Message.styles'
import MessageBubble from './MessageBubble'
import MessageStatus from './MessageStatus'

type MessageProps = {
  message: Message | null
  seen?: boolean
  prevItem?: Message
  nextItem?: Message
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Message({ message, seen, prevItem, nextItem }: MessageProps): React.JSX.Element {
  const { gesture, animatedStyle, translateX } = useMessageSwipe({
    menuWidth: 164,
    replyThreshold: 500,
    onReply: () => console.log('Reply'),
  })
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
      <GestureDetector gesture={gesture}>
        <View style={styles.messageBubbleWrapper}>
          <MessageBubble style={animatedStyle} message={message} />
          <MessageActions progress={translateX} />
        </View>
      </GestureDetector>

      <LayoutAnimationConfig skipEntering skipExiting>
        {isGroupEnd && <MessageStatus message={message} seen={seen} />}
      </LayoutAnimationConfig>
    </AnimatedPressable>
  )
}
