import { Avatar } from '@components/ui'
import { zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import type { Chat } from '@interfaces'
import { Text, View } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './EmptyModal.styles'

type EmptyModalProps = {
  chat: Chat | null
  visible: boolean
}

export default function EmptyModal({ chat, visible }: EmptyModalProps): React.ReactNode {
  const keyboard = useReanimatedKeyboardAnimation()

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] }
  })

  return visible ? (
    <Animated.View style={[styles.wrapper, animatedStyles]}>
      <Animated.View entering={zoomAnimationIn} exiting={zoomAnimationOut} style={styles.modal}>
        <Avatar username={chat?.recipient?.username} image={chat?.recipient?.avatar} size="xl" />
        <Text style={styles.title(false)}>
          Вы начали чат с <Text style={styles.title(true)}>{chat?.recipient?.username}</Text> - отправьте своё первое сообщение!
        </Text>
      </Animated.View>
    </Animated.View>
  ) : null
}
