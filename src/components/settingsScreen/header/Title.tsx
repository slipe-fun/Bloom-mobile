import type { User as UserType } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import { type LayoutChangeEvent, Text, type TextStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from '../Header.styles'

interface UserProps {
  scrollY: SharedValue<number>
  user: UserType
  onLayout: (layout: LayoutChangeEvent) => void
}

export default function SettingsTitle({ scrollY, user, onLayout }: UserProps) {
  const { theme } = useUnistyles()
  const { snapEndPosition } = useSettingsScreenStore()

  const animatedStyle = useAnimatedStyle(
    (): TextStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.get(), [0, snapEndPosition], [1, theme.fontSize.lg / (theme.fontSize.xxl - 4)], 'clamp'),
        },
        {
          translateY: interpolate(scrollY.get(), [0, snapEndPosition], [0, -8], 'clamp'),
        },
      ],
    }),
  )

  return (
    <>
      {/* This text component only for layout measurement (because we need to get minimised title height */}
      <Text pointerEvents="none" onLayout={onLayout} style={styles.measureTitle}>
        {user?.display_name}
      </Text>

      {/* This is actual title */}
      <Animated.Text style={[styles.title, animatedStyle]}>{user?.display_name}</Animated.Text>
    </>
  )
}
