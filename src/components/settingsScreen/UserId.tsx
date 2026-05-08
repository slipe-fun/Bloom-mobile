import type { User } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type { TextStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Header.styles'

interface FloatingHeaderProps {
  scrollY: SharedValue<number>
  user: User
}

export default function UserId({ scrollY, user }: FloatingHeaderProps) {
  const headerHeight = useSettingsScreenStore((state) => state.headerHeight)

  const animatedStyle = useAnimatedStyle(
    (): TextStyle => ({
      opacity: interpolate(scrollY.get(), [0, headerHeight], [1, 0], 'clamp'),
      transform: [{ scale: interpolate(scrollY.get(), [0, headerHeight], [1, 1], 'clamp') }],
    }),
  )
  return <Animated.Text style={[styles.subTitle, animatedStyle]}>ID: {user?.id}</Animated.Text>
}
