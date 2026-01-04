import { GradientBlur } from '@components/ui'
import { useInsets } from '@hooks'
import type React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Header.styles'

type FloatingHeaderProps = {
  scrollY: SharedValue<number>
  headerHeight: number
}

export default function FloatingHeader({ scrollY, headerHeight }: FloatingHeaderProps): React.JSX.Element {
  const insets = useInsets()

  const scrollTarget = headerHeight - insets.top

  const animatedViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: interpolate(scrollY.get(), [0, 8], [0, 1]),
    }),
    [scrollTarget],
  )

  const animatedTextStyle = useAnimatedStyle(
    (): TextStyle => ({
      opacity: interpolate(scrollY.get(), [0, scrollTarget], [0, 1]),
      transform: [{ translateY: interpolate(scrollY.get(), [0, scrollTarget], [24, 0], 'clamp') }],
    }),
    [scrollTarget],
  )

  return (
    <Animated.View pointerEvents="none" style={[styles.floatingHeader(insets.top), animatedViewStyle]}>
      <GradientBlur direction="top-to-bottom" />
      <Animated.Text style={[styles.title(false), animatedTextStyle]}>Поиск</Animated.Text>
    </Animated.View>
  )
}
