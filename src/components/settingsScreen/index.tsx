import { useInsets } from '@hooks'
import type { User as UserType } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type React from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Header.styles'
import HeaderAvatar from './header/avatar/index'
import SettingsTitle from './header/Title'

interface HeaderProps {
  scrollY: SharedValue<number>
  user: UserType
}

export default function Header({ scrollY, user }: HeaderProps): React.JSX.Element {
  const insets = useInsets()
  const { setSnapEndPosition, setHeaderHeight, snapEndPosition } = useSettingsScreenStore()

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    setSnapEndPosition(event.nativeEvent.layout.height)
    setHeaderHeight(event.nativeEvent.layout.height)
    console.log(event.nativeEvent.layout.height, insets.top)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.get(), [0, 135], [0, -135], 'clamp') }],
  }))

  return (
    <Animated.View onLayout={onHeaderLayout} style={[styles.header, animatedStyle]}>
      <HeaderAvatar user={user} scrollY={scrollY} />
      <SettingsTitle scrollY={scrollY} user={user} />
    </Animated.View>
  )
}
