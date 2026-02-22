import type { User as UserType } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type { TextStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from '../Header.styles'

interface UserProps {
  scrollY: SharedValue<number>
  user: UserType
}

export default function SettingsTitle({ scrollY, user }: UserProps): React.JSX.Element {
  const { theme } = useUnistyles()
  const { snapEndPosition } = useSettingsScreenStore()

  const animatedStyle = useAnimatedStyle(
    (): TextStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.get(), [0, 135], [1, theme.fontSize.lg / (theme.fontSize.xxl - 4)], 'clamp'),
        },
        {
          translateY: interpolate(scrollY.get(), [0, 135], [0, -(theme.fontSize.lg - theme.fontSize.xxl - 4) / 2], 'clamp'),
        },
      ],
    }),
  )

  return <Animated.Text style={[styles.title, animatedStyle]}>{user?.display_name}</Animated.Text>
}
