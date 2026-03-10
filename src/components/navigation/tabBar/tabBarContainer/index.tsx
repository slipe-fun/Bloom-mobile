import { getFadeIn, getFadeOut, layoutAnimation, springy, vSlideAnimationIn, vSlideAnimationOut } from '@constants/animations'
import { useNavigationState } from '@react-navigation/native'
import useTabBarStore from '@stores/tabBar'
import { useRef } from 'react'
import type { TextInput } from 'react-native'
import Animated, { LayoutAnimationConfig, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import TabBarIndicator from './Indicator'
import TabBarItem from './Item'
import TabBarButton from './search'
import TabBarSearchBackButton from './search/backButton'
import TabBarSearchInput from './search/Input'
import { styles } from './TabBarContainer.styles'

export default function TabBarContainer() {
  const { search, searchFocused } = useTabBarStore()
  const state = useNavigationState((state) => state)
  const inputRef = useRef<TextInput>(null)
  const scale = useSharedValue(1)
  const x = useSharedValue(0)

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? 1.035 : 1, springy))
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return (
    <Animated.View exiting={vSlideAnimationOut} entering={vSlideAnimationIn} style={styles.container}>
      <LayoutAnimationConfig skipEntering skipExiting>
        {search && !searchFocused && <TabBarSearchBackButton />}
        <Animated.View
          onTouchStart={() => handlePress(true)}
          onTouchEnd={() => handlePress(false)}
          layout={layoutAnimation}
          style={[styles.tabBarWrapper, animatedStyle]}
        >
          {search ? (
            <TabBarSearchInput key="tabBarSearchInput" ref={inputRef} />
          ) : (
            <Animated.View key="tabBarContent" exiting={getFadeOut()} entering={getFadeIn()} style={styles.tabBar}>
              <TabBarIndicator x={x} />
              {state.routes.map((route, index) => {
                return <TabBarItem key={route.key} route={route} focused={state.index === index} />
              })}
            </Animated.View>
          )}
        </Animated.View>
        <TabBarButton inputRef={inputRef} />
      </LayoutAnimationConfig>
    </Animated.View>
  )
}
