import type { Message } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import type React from 'react'
import { Text, View } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { staticColor } from 'unistyles'
// import ReplyBlock from '../replyBlock'
import { styles } from './Message.styles'

interface MessageBubbleProps {
  message: Message | null
  seen: boolean
}

export default function MessageBubble({ message, seen }: MessageBubbleProps): React.JSX.Element {
  const isMe: boolean = message?.isMe
  const statusValue = useSharedValue(0)

  const animatedViewStyles = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(statusValue.get(), [0, 1], [staticColor.primaryBackdrop, staticColor.primary]),
    }),
    [seen],
  )

  const animatedTextStyles = useAnimatedStyle(
    () => ({
      color: interpolateColor(statusValue.get(), [0, 1], [staticColor.primary, staticColor.white]),
    }),
    [seen],
  )

  return (
    <Animated.View style={[styles.message(isMe, seen), animatedViewStyles]}>
      {/* <ReplyBlock isMe={isMe} message={message.reply_to} /> */}

      <View style={styles.messageContent}>
        <Animated.Text style={[styles.text(isMe), animatedTextStyles]}>
          {message?.content}
          <Text>{'          '}</Text>
        </Animated.Text>
        <Animated.Text style={[styles.secondaryText(isMe), animatedTextStyles]}>{formatSentTime(message?.date)}</Animated.Text>
      </View>
    </Animated.View>
  )
}
