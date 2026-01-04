import { Button, Icon } from '@components/ui'
import type { Message } from '@interfaces'
import type React from 'react'
import Animated, { type SharedValue } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Actions.styles'

type MessageActionsProps = {
  message?: Message
  progress?: SharedValue<number>
}

const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function MessageActions({ message, progress }: MessageActionsProps): React.JSX.Element {
  const { theme } = useUnistyles()
  return (
    <Animated.View style={styles.messageActions}>
      <AnimatedButton style={styles.delete} variant="icon">
        <Icon icon="trash" size={26} color={theme.colors.red} />
      </AnimatedButton>
      <AnimatedButton style={styles.copy} variant="icon">
        <Icon icon="file" size={26} color={theme.colors.primary} />
      </AnimatedButton>
      <AnimatedButton style={styles.reply} variant="icon">
        <Icon icon="arrow.left" size={26} color={theme.colors.yellow} />
      </AnimatedButton>
    </Animated.View>
  )
}
