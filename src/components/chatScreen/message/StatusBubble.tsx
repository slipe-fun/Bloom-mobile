import { Icon } from '@components/ui'
import { quickSpring } from '@constants/easings'
import type { ViewStyle } from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './Message.styles'

export const SWIPE_THRESHOLD = -60

interface StatusBubbleProps {
  seen: boolean
  isMe: boolean
  swipeX: SharedValue<number>
  hapticsTriggered: SharedValue<boolean>
}

export default function StatusBubble({ isMe, seen, swipeX, hapticsTriggered }: StatusBubbleProps) {
  const animatedTheme = useAnimatedTheme()
  const triggeredAnimation = useSharedValue(0)

  useAnimatedReaction(
    () => hapticsTriggered.get(),
    (v) => {
      triggeredAnimation.set(withSpring(v ? 1 : 0, quickSpring))
    },
  )

  const seenTranslateXStart = seen && isMe ? 24 : 0
  const seenTranslateXEnd = seen ? 24 : 12

  const animatedStyle = useAnimatedStyle((): ViewStyle => {
    const scale = interpolate(swipeX.get(), [SWIPE_THRESHOLD, 0], [4.5, 1], 'clamp')

    const colors = animatedTheme.get().colors

    const backgroundColor = interpolateColor(
      triggeredAnimation.get(),
      [0, 1],
      [isMe ? colors.primaryBackdrop : colors.foreground, colors.primary],
    )

    return {
      backgroundColor,
      transform: [{ scale }],
    }
  })

  const animatedWrapperStyle = useAnimatedStyle((): ViewStyle => {
    const translateX = interpolate(swipeX.get(), [SWIPE_THRESHOLD, 0], [seenTranslateXEnd, seenTranslateXStart], 'clamp')

    return {
      transform: [{ translateX }],
    }
  })

  const animatedIconStyle = useAnimatedStyle((): ViewStyle => {
    const iconVisibility = interpolate(swipeX.get(), [SWIPE_THRESHOLD, 0], [1, 0], 'clamp')

    return {
      opacity: iconVisibility,
      transform: [{ scale: iconVisibility }],
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
