import { getFadeIn, getFadeOut, layoutAnimation, vSlideAnimationIn, vSlideAnimationOut } from '@constants/animations'
import { useNavigationState } from '@react-navigation/native'
import useTabBarStore from '@stores/tabBar'
import { BlurView } from 'expo-blur'
import type React from 'react'
import { useCallback, useRef } from 'react'
import { Platform, type LayoutChangeEvent, type TextInput } from 'react-native'
import Animated, { LayoutAnimationConfig, useSharedValue } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import TabBarIndicator from './Indicator'
import TabBarItem from './Item'
import TabBarSearchButton from './search'
import TabBarSearchBackButton from './search/backButton'
import TabBarSearchInput from './search/Input'
import { styles } from './TabBarContainer.styles'

export default function TabBarContainer(): React.JSX.Element {
  const { isSearch, isSearchFocused } = useTabBarStore()
  const state = useNavigationState((state) => state)
  const inputRef = useRef<TextInput>(null)
  const tabBarWidth = useSharedValue(0)
  const colorProgress = useSharedValue(0)
  const x = useSharedValue(0)

  const onLayoutTabBar = useCallback((event: LayoutChangeEvent) => {
    if (tabBarWidth.value <= 1) tabBarWidth.value = event.nativeEvent.layout.width
  }, [])

  return (
    <Animated.View exiting={vSlideAnimationOut} entering={vSlideAnimationIn} style={styles.container}>
      <LayoutAnimationConfig skipEntering skipExiting>
        {isSearch && !isSearchFocused && <TabBarSearchBackButton />}
        <Animated.View layout={layoutAnimation} style={styles.tabBarWrapper}>
          {Platform.OS === "ios" && <BlurView style={StyleSheet.absoluteFill} intensity={40} tint="systemChromeMaterialDark" />}
          {isSearch ? (
            <TabBarSearchInput key="tabBarSearchInput" ref={inputRef} />
          ) : (
            <Animated.View
              key="tabBarContent"
              exiting={getFadeOut()}
              entering={getFadeIn()}
              onLayout={onLayoutTabBar}
              style={styles.tabBar}
            >
              <TabBarIndicator
                x={x}
                colorProgress={colorProgress}
                index={state.index}
                routes={state.routes.map((s) => s.name)}
                tabBarWidth={tabBarWidth}
              />
              {state.routes.map((route, index) => {
                return <TabBarItem key={route.key} route={route} focused={state.index === index} />
              })}
            </Animated.View>
          )}
        </Animated.View>
        <TabBarSearchButton inputRef={inputRef} />
      </LayoutAnimationConfig>
    </Animated.View>
  )
}
