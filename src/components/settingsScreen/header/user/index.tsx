import type { User } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type { TextStyle, ViewStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './User.styles'

type UserProps = {
  scrollY: SharedValue<number>
  user: User
}

export default function User({ scrollY, user }: UserProps): React.JSX.Element {
  const { theme } = useUnistyles()
  const { snapEndPosition } = useSettingsScreenStore()

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.get(), [0, snapEndPosition], [1, 0]),
  }))

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.get(), [0, snapEndPosition], [1, theme.fontSize.lg / (theme.fontSize.xxl - 2)], 'clamp'),
        },
      ],
    }),
  )

  const animatedSubTextStyle = useAnimatedStyle(
    (): TextStyle => ({
      transform: [
        {
          translateY: interpolate(scrollY.get(), [0, snapEndPosition], [0, -(theme.fontSize.xxl - 2 - theme.fontSize.lg)], 'clamp'),
        },
        { scale: interpolate(scrollY.get(), [0, snapEndPosition], [1, 0.85], 'clamp') },
      ],
    }),
  )

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.Text style={[styles.name, animatedStyle]}>{user?.display_name}</Animated.Text>
      <Animated.Text style={[styles.mail, animatedSubTextStyle]}>{user?.email}</Animated.Text>
    </Animated.View>
  )
}
