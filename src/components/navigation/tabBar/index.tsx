import { GradientBlur } from '@components/ui'
import { layoutAnimation } from '@constants/animations'
import { useInsets } from '@hooks'
import useChatsStore from '@stores/chats'
import useTabBarStore from '@stores/tabBar'
import type React from 'react'
import { useCallback } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import TabBarActionButtonDelete from './deleteButton'
import { styles } from './TabBar.styles'
import TabBarContainer from './tabBarContainer'

export default function TabBar({ state, navigation }): React.JSX.Element {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const { setTabBarHeight, tabBarHeight } = useTabBarStore()
  const { edit } = useChatsStore()
  const { progress: keyboardProgress, height: keyboardHeight } = useReanimatedKeyboardAnimation()

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(keyboardProgress.get(), [0, 1], [0, keyboardHeight.value + (insets.bottom - theme.spacing.lg)], 'clamp') },
    ],
    paddingBottom: insets.bottom,
    paddingHorizontal: keyboardProgress.get() >= 0.1 ? theme.spacing.lg : theme.spacing.xxxl,
  }))

  const onLayoutTabBar = useCallback((event: LayoutChangeEvent) => {
    if (tabBarHeight <= 1) setTabBarHeight(event.nativeEvent.layout.height)
  }, [])

  return (
    <Animated.View
      onLayout={(event) => onLayoutTabBar(event)}
      layout={layoutAnimation}
      style={[styles.tabBarContainer, animatedContainerStyle]}
    >
      <GradientBlur />
      {!edit ? <TabBarContainer state={state} navigation={navigation} /> : <TabBarActionButtonDelete />}
    </Animated.View>
  )
}
