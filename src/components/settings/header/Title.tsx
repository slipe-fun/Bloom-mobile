import { base } from '@design/base'
import type { User as UserType } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type { LayoutChangeEvent, TextStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { styles } from '../Header.styles'

interface UserProps {
  scrollY: SharedValue<number>
  user: UserType
}

const POSITION_RATIO = 1.62

export default function SettingsTitle({ scrollY, user }: UserProps) {
  const headerHeight = useSettingsScreenStore((state) => state.headerHeight)
  const titleEndPosition = useSharedValue(0)

  const onTitleLayout = (event: LayoutChangeEvent) => {
    titleEndPosition.set(event.nativeEvent.layout.height * 1.25)
  }

  const animatedStyle = useAnimatedStyle(
    (): TextStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.get(), [0, headerHeight / POSITION_RATIO], [1, base.fontSize.md / base.fontSize.xxl], 'clamp'),
        },
        {
          translateY: interpolate(scrollY.get(), [0, headerHeight / POSITION_RATIO], [0, -titleEndPosition.get()], 'clamp'),
        },
      ],
    }),
  )

  return (
    <Animated.Text onLayout={onTitleLayout} style={[styles.title, animatedStyle]}>
      {user?.display_name || user?.username}
    </Animated.Text>
  )
}
