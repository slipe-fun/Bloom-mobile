import type { Message } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import type React from 'react'
import { Text, View, type ViewStyle } from 'react-native'
import Animated, { type AnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import ReplyBlock from '../replyBlock'
import { styles } from './Message.styles'

type MessageBubbleProps = {
  message: Message | null
  style?: AnimatedStyle<ViewStyle>
}

export default function MessageBubble({ message, style }: MessageBubbleProps): React.JSX.Element {
  const { theme } = useUnistyles()

  const isMe: boolean = message?.isMe

  return (
    <Animated.View style={[styles.message(isMe), style]}>
      <ReplyBlock isMe={isMe} message={message.reply_to} />

      <View style={styles.messageContent}>
        <Text style={styles.text(isMe)}>
          {message?.content}
          <Text>{'         '}</Text>
        </Text>
        <Text style={styles.secondaryText(isMe)}>{formatSentTime(message?.date)}</Text>
      </View>
    </Animated.View>
  )
}
