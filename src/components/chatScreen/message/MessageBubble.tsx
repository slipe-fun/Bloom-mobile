import type { Message } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import type React from 'react'
import { Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import ReplyBlock from '../replyBlock'
import { styles } from './Message.styles'

type MessageBubbleProps = {
  message: Message | null
}

export default function MessageBubble({ message }: MessageBubbleProps): React.JSX.Element {
  const isMe: boolean = message?.isMe

  return (
    <Animated.View style={styles.message(isMe)}>
      <ReplyBlock isMe={isMe} message={message.reply_to} />

      <View style={styles.messageContent}>
        <Text style={styles.text(isMe)}>
          {message?.content}
          <Text>{'          '}</Text>
        </Text>
        <Text style={styles.secondaryText(isMe)}>{formatSentTime(message?.date)}</Text>
      </View>
    </Animated.View>
  )
}
