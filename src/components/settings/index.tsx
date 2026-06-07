import { Button, GradientBlur, Icon } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type { User as UserType } from '@interfaces'
import { useSettingsHeaderStore } from '@stores/settingsHeader'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Header.styles'
import HeaderAvatar from './header/avatar'
import SettingsTitle from './header/Title'

interface HeaderProps {
  scrollY: SharedValue<number>
  user: UserType
  loading: boolean
}

const SCROLL_OVERSHOOT = 1000
const POSITION_RATIO = 1.62

export default function Header({ scrollY, user, loading }: HeaderProps) {
  const insets = useInsets()
  const { back } = useRouter()
  const { theme } = useUnistyles()
  const { setSnapPosition, setHeaderHeight, snapPosition, headerHeight } = useSettingsHeaderStore()

  const gradient = SIZE_MAP.md + insets.top + base.spacing.xxl

  const onHeaderLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const header = event.nativeEvent.layout.height

      if (header !== headerHeight) {
        setSnapPosition(header - gradient)
        setHeaderHeight(header)
      }
    },
    [headerHeight, gradient, setSnapPosition, setHeaderHeight],
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.get(),
          [-SCROLL_OVERSHOOT, 0, headerHeight / POSITION_RATIO],
          [SCROLL_OVERSHOOT, 0, -snapPosition],
          'clamp',
        ),
      },
    ],
  }))

  return (
    <>
      <View style={styles.gradientWrapper(gradient, insets.top)}>
        <GradientBlur pointerEvents="none" gray direction="top-to-bottom" />
        <Button variant="icon" icon={<Icon color={theme.colors.text} size={26} icon="x" />} size="md" onPress={() => back()} />
        <Button variant="icon" icon={<Icon color={theme.colors.text} size={26} icon="pencil" />} size="md" onPress={() => back()} />
      </View>
      <Animated.View pointerEvents="none" onLayout={onHeaderLayout} style={[styles.header, animatedStyle]}>
        <HeaderAvatar user={user} scrollY={scrollY} loading={loading} />
        <SettingsTitle scrollY={scrollY} user={user} />
      </Animated.View>
    </>
  )
}
