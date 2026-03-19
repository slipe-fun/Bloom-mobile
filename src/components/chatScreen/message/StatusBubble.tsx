import { quickSpring } from '@constants/easings'
import type { ViewStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { styles } from './Message.styles'

interface StatusBubbleProps {
  seen: boolean
  isMe: boolean
  swipeX: SharedValue<number>
  hapticsTriggered: SharedValue<boolean>
}

export default function StatusBubble({ isMe, seen, swipeX, hapticsTriggered }: StatusBubbleProps) {
  const animatedStyle = useAnimatedStyle((): ViewStyle => {
    const scale = interpolate(swipeX.get(), [-60, 0], [4.5, 1], 'clamp')
    const translateX = interpolate(swipeX.get(), [-60, 0], [4, 0], 'clamp')

    return {
      transform: [{ scale }, { translateX }],
    }
  })

  const animatedEffectStyle = useAnimatedStyle((): ViewStyle => {
    const scale = withSpring(hapticsTriggered.get() ? 4 : 1, quickSpring)
    const translateX = interpolate(swipeX.get(), [-60, 0], [4, 0], 'clamp')
    const opacity = withSpring(hapticsTriggered.get() ? 0 : 1, quickSpring)

    return {
      opacity,
      transform: [{ scale }, { translateX }],
    }
  })

  return <Animated.View style={[styles.statusBubble(isMe), animatedStyle]}></Animated.View>
}
