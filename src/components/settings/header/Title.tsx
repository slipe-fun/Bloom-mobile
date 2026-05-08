import { base } from '@design/base'
import type { User as UserType } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import { useRef } from 'react'
import type { LayoutChangeEvent, TextStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from '../Header.styles'

interface UserProps {
  scrollY: SharedValue<number>
  user: UserType
}

export default function SettingsTitle({ scrollY, user }: UserProps) {
  const headerHeight = useSettingsScreenStore((state) => state.headerHeight)
  const titleHeight = useRef(0)

  const onTitleLayout = (event: LayoutChangeEvent) => {
    titleHeight.current = event.nativeEvent.layout.height
  }

  const animatedStyle = useAnimatedStyle(
    (): TextStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.get(), [0, headerHeight / 1.62], [1, base.fontSize.md / base.fontSize.xxl], 'clamp'),
        },
        {
          translateY: interpolate(scrollY.get(), [0, headerHeight / 1.62], [0, -titleHeight.current * 1.5], 'clamp'),
        },
      ],
    }),
  )

  return (
    <Animated.Text onLayout={onTitleLayout} style={[styles.title, animatedStyle]}>
      {user?.display_name}
    </Animated.Text>
  )
}
