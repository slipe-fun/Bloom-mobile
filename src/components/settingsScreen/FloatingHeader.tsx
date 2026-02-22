import { GradientBlur } from '@components/ui'
import { useInsets } from '@hooks'
import type { User } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Header.styles'

interface FloatingHeaderProps {
  scrollY: SharedValue<number>
  user: User
}

export default function FloatingHeader({ scrollY, user }: FloatingHeaderProps): React.JSX.Element {
  const insets = useInsets()
  const { snapEndPosition } = useSettingsScreenStore()

  const animatedViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: interpolate(scrollY.get(), [snapEndPosition / 2, snapEndPosition / 2 + 8], [0, 1]),
    }),
  )

  const animatedTextStyle = useAnimatedStyle(
    (): TextStyle => ({
      opacity: interpolate(scrollY.get(), [snapEndPosition / 2, snapEndPosition], [0, 1]),
      transform: [{ translateY: interpolate(scrollY.get(), [snapEndPosition / 2, snapEndPosition], [24, 0], 'clamp') }],
    }),
  )

  return (
    <Animated.View pointerEvents="none" style={[styles.floatingHeader(insets.top), animatedViewStyle]}>
      <GradientBlur direction="top-to-bottom" />
      <Animated.Text style={[styles.floatingHeaderTitle, animatedTextStyle]}>{user?.display_name}</Animated.Text>
    </Animated.View>
  )
}
