import type { Message } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import { Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
// import ReplyBlock from '../replyBlock'
import { styles } from './Message.styles'

interface MessageBubbleProps {
  message: Message | null
  seen: boolean
}

export default function MessageBubble({ message, seen }: MessageBubbleProps) {
  const isMe: boolean = message?.isMe

  return (
    <Animated.View style={[styles.message(isMe)]}>
      {/* <ReplyBlock isMe={isMe} message={message.reply_to} /> */}

      <View style={styles.messageContent}>
        <Animated.Text style={[styles.text(isMe)]}>
          {message?.content}
          <Text>{'         '}</Text>
        </Animated.Text>
        <Animated.Text style={[styles.secondaryText(isMe)]}>{formatSentTime(message?.date)}</Animated.Text>
      </View>
    </Animated.View>
  )
}
