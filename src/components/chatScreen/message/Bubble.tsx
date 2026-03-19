import { messageAnimationIn } from '@constants/animations'
import type { Message } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import { Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { styles } from './Message.styles'

interface MessageBubbleProps {
  message: Message | null
  shouldAnimate: boolean
}

export default function MessageBubble({ message, shouldAnimate }: MessageBubbleProps) {
  const isMe: boolean = message?.isMe

  return (
    <Animated.View entering={shouldAnimate ? messageAnimationIn : null} style={[styles.message(isMe)]}>
      <View style={styles.messageContent}>
        <Text style={[styles.text(isMe)]}>
          {message?.content}
          <View style={styles.timeSpacer} />
        </Text>
        <Animated.Text style={[styles.secondaryText(isMe)]}>{formatSentTime(message?.date)}</Animated.Text>
      </View>
    </Animated.View>
  )
}
