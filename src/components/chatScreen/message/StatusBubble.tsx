import { Icon } from '@components/ui'
import { quickSpring } from '@constants/easings'
import type { ViewStyle } from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './Message.styles'

interface StatusBubbleProps {
  seen: boolean
  isMe: boolean
  swipeX: SharedValue<number>
  hapticsTriggered: SharedValue<boolean>
}

export default function StatusBubble({ isMe, seen, swipeX, hapticsTriggered }: StatusBubbleProps) {
  const animatedTheme = useAnimatedTheme()

  const triggeredAnimation = useDerivedValue(() => {
    return withSpring(hapticsTriggered.get() ? 1 : 0, quickSpring)
  })

  const seenTranslateXStart = seen ? 24 : 0
  const seenTranslateXEnd = seen ? 24 : 12

  const animatedStyle = useAnimatedStyle((): ViewStyle => {
    const scale = interpolate(swipeX.get(), [-60, 0], [4.5, 1], 'clamp')
    const backgroundColor = interpolateColor(
      triggeredAnimation.get(),
      [0, 1],
      [isMe ? animatedTheme.get().colors.primaryBackdrop : animatedTheme.get().colors.foreground, animatedTheme.get().colors.primary],
    )

    return {
      backgroundColor,
      transform: [{ scale }],
    }
  })

  const animatedWrapperStyle = useAnimatedStyle((): ViewStyle => {
    const translateX = interpolate(swipeX.get(), [-60, 0], [seenTranslateXEnd, seenTranslateXStart], 'clamp')

    return {
      transform: [{ translateX }],
    }
  })

  const animatedIconStyle = useAnimatedStyle((): ViewStyle => {
    const opacity = interpolate(swipeX.get(), [-60, 0], [1, 0], 'clamp')
    const scale = interpolate(swipeX.get(), [-60, 0], [1, 0], 'clamp')

    return {
      opacity,
      transform: [{ scale }],
    }
  })

  return (
    <Animated.View style={[animatedWrapperStyle, styles.statusBubbleWrapper]}>
      <Animated.View style={[styles.statusBubble(isMe), animatedStyle]} />
      <Animated.View style={animatedIconStyle}>
        <Icon icon="arrow.left" size={24} />
      </Animated.View>
    </Animated.View>
  )
}
