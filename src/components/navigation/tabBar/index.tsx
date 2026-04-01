import { GradientBlur } from '@components/ui'
import { layoutAnimation } from '@constants/animations'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import useTabBarStore from '@stores/tabBar'
import { useEffect, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './TabBar.styles'
import TabBarContainer from './tabBarContainer'

export const TAB_BAR_HEIGHT = 54

const AnimatedStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function TabBar() {
  const setHeight = useTabBarStore((state) => state.setHeight)
  const setWidth = useTabBarStore((state) => state.setWidth)
  const { width } = useWindowDimensions()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const insets = useInsets()

  const tabBarHeight = useMemo(() => TAB_BAR_HEIGHT + base.spacing.lg + insets.bottom, [base, insets.bottom])
  const tabBarWidth = useMemo(() => width - base.spacing.xxl * 2 - base.spacing.md - TAB_BAR_HEIGHT, [width, base])

  const animatedViewStyles = useAnimatedStyle(() => ({
    paddingHorizontal: keyboardProgress.get() > 0.5 ? base.spacing.lg : base.spacing.xxl,
  }))

  useEffect(() => {
    setHeight(tabBarHeight)
    setWidth(tabBarWidth)
  }, [tabBarHeight, tabBarWidth])

  return (
    <AnimatedStickyView
      pointerEvents="box-only"
      layout={layoutAnimation}
      offset={{ opened: -base.spacing.lg, closed: -insets.bottom }}
      style={[styles.tabBarContainer, animatedViewStyles]}
    >
      <GradientBlur keyboard />
      <TabBarContainer />
    </AnimatedStickyView>
  )
}
