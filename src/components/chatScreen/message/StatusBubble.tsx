import Animated from 'react-native-reanimated'
import { styles } from './Message.styles'

interface StatusBubbleProps {
  seen: boolean
  isMe: boolean
}

export default function StatusBubble({ isMe, seen }: StatusBubbleProps) {
  return <Animated.View style={styles.statusBubble(isMe)} />
}
