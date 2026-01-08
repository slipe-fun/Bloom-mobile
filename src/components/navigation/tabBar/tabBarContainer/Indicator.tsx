import { quickSpring, springy } from '@constants/animations'
import { TAB_COLORS } from '@constants/tabBar'
import type { TabValue } from '@interfaces'
import { useNavigationState } from '@react-navigation/native'
import useTabBarStore from '@stores/tabBar'
import { useEffect, useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import Animated, { interpolateColor, type SharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { styles } from './TabBarContainer.styles'

interface TabBarIndicatorProps {
  x: SharedValue<number>
  colorProgress: SharedValue<number>
}

export default function TabBarIndicator({ x, colorProgress }: TabBarIndicatorProps) {
  const tabBarWidth = useTabBarStore((state) => state.tabBarWidth)
  const state = useNavigationState((state) => state)

  const index = state.index
  const routes = state.routes.map((s) => s.name) as TabValue[]
  const tabsCount = routes?.length
  const TAB_COLORS_RES = TAB_COLORS(true)

  const { colorInputRange, colorOutputRange } = useMemo(() => {
    const keys = Object.keys(TAB_COLORS_RES)
    return {
      colorInputRange: routes.map((e) => keys.indexOf(e)),
      colorOutputRange: Object.values(TAB_COLORS_RES) as string[],
    }
  }, [routes, TAB_COLORS_RES])

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ translateX: x.get() }],
      width: tabBarWidth / 4 + 5,
      backgroundColor: interpolateColor(colorProgress.get(), colorInputRange, colorOutputRange),
    }),
  )

  useEffect(() => {
    if (tabsCount <= 0) return

    const target = (tabBarWidth / 4 - 4.5) * index

    x.set(withSpring(target, springy))

    const colorIndex = Object.keys(TAB_COLORS_RES).indexOf(routes[index])
    colorProgress.set(withSpring(colorIndex, quickSpring))
  }, [index, tabsCount, tabBarWidth])

  return <Animated.View style={[styles.indicator, animatedStyle]} />
}
