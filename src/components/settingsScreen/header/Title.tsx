import { base } from '@design/base'
import type { User as UserType } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type { TextStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from '../Header.styles'

interface UserProps {
  scrollY: SharedValue<number>
  user: UserType
}

export default function SettingsTitle({ scrollY, user }: UserProps) {
  const { snapEndPosition } = useSettingsScreenStore()

  const animatedStyle = useAnimatedStyle(
    (): TextStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.get(), [0, snapEndPosition], [1, base.fontSize.md / base.fontSize.xxl], 'clamp'),
        },
        {
          translateY: interpolate(scrollY.get(), [0, snapEndPosition], [0, -48], 'clamp'),
        },
      ],
    }),
  )

  return <Animated.Text style={[styles.title, animatedStyle]}>{user?.display_name}</Animated.Text>
}
