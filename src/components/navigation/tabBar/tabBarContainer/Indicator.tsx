import { springy } from '@constants/animations'
import { useNavigationState } from '@react-navigation/native'
import useTabBarStore from '@stores/tabBar'
import { useEffect } from 'react'
import type { ViewStyle } from 'react-native'
import Animated, { type SharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { styles } from './TabBarContainer.styles'

interface TabBarIndicatorProps {
  x: SharedValue<number>
}

export default function TabBarIndicator({ x }: TabBarIndicatorProps) {
  const tabBarWidth = useTabBarStore((state) => state.width)
  const state = useNavigationState((state) => state)

  const index = state.index
  const tabsCount = state.routes.map((s) => s.name)?.length

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ translateX: x.get() }],
      width: tabBarWidth / 4 + 4,
    }),
  )

  useEffect(() => {
    if (tabsCount <= 0) return

    const target = (tabBarWidth / 4 - 5) * index

    x.set(withSpring(target, springy))
  }, [index, tabsCount, tabBarWidth])

  return <Animated.View style={[styles.indicator, animatedStyle]} />
}
