import { GradientBlur } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type { User as UserType } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import { useState } from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Header.styles'
import HeaderAvatar from './header/avatar/index'
import SettingsTitle from './header/Title'

interface HeaderProps {
  scrollY: SharedValue<number>
  user: UserType
  loading: boolean
}

export default function Header({ scrollY, user, loading }: HeaderProps) {
  const insets = useInsets()
  const [gradientHeight, setGradientHeight] = useState(0)
  const { setSnapEndPosition, setHeaderHeight, snapEndPosition, headerHeight } = useSettingsScreenStore()

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    const gradient = SIZE_MAP.md + insets.top + base.spacing.xxl
    const header = event.nativeEvent.layout.height
    setSnapEndPosition(header - gradient)
    setGradientHeight(gradient)
    setHeaderHeight(header)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.get(), [-1000, 0, headerHeight / 1.62], [1000, 0, -snapEndPosition], 'clamp'),
      },
    ],
  }))

  return (
    <>
      <View pointerEvents="none" style={styles.gradientWrapper(gradientHeight)}>
        <GradientBlur gray direction="top-to-bottom" />
      </View>
      <Animated.View pointerEvents="none" onLayout={onHeaderLayout} style={[styles.header, animatedStyle]}>
        <HeaderAvatar user={user} scrollY={scrollY} loading={loading} />
        <SettingsTitle scrollY={scrollY} user={user} />
      </Animated.View>
    </>
  )
}
