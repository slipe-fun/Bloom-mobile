import type { User } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type { TextStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Header.styles'

interface FloatingHeaderProps {
  scrollY: SharedValue<number>
  user: User
}

export default function UserEmail({ scrollY, user }: FloatingHeaderProps) {
  const snapEndPosition = useSettingsScreenStore((state) => state.snapEndPosition)

  const animatedStyle = useAnimatedStyle(
    (): TextStyle => ({
      opacity: interpolate(scrollY.get(), [0, snapEndPosition], [1, 0], 'clamp'),
      transform: [{ scale: interpolate(scrollY.get(), [0, snapEndPosition], [1, 0.85], 'clamp') }],
    }),
  )
  return <Animated.Text style={[styles.subTitle, animatedStyle]}>{user?.email}</Animated.Text>
}
