import { zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import type { Message } from '@interfaces'
import type React from 'react'
import Animated from 'react-native-reanimated'
import { styles } from './Message.styles'

type MessageStatusProps = {
  message: Message
  seen: boolean
}

export default function MessageStatus({ message, seen }: MessageStatusProps): React.JSX.Element {
  return message?.isMe && !seen ? (
    <Animated.Text exiting={zoomAnimationOut} entering={zoomAnimationIn} key="message-arrived" style={styles.metaRowText}>
      Доставлено
    </Animated.Text>
  ) : (
    <Animated.Text exiting={zoomAnimationOut} entering={zoomAnimationIn} key="message-seen" style={styles.metaRowText}>
      Просмотрено
    </Animated.Text>
  )
}
