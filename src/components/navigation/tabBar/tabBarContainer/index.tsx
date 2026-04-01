import { getFadeIn, getFadeOut, layoutAnimation, springy, vSlideAnimationIn, vSlideAnimationOut } from '@constants/animations'
import { PRESSABLE_INPUT_SCALE } from '@constants/animations/values'
import { useNavigationState } from '@react-navigation/native'
import useChatsStore from '@stores/chats'
import useTabBarStore from '@stores/tabBar'
import { useRef } from 'react'
import type { TextInput } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import TabBarDelete from '../delete'
import TabBarIndicator from './Indicator'
import TabBarItem from './Item'
import TabBarSearchBackButton from './search/backButton'
import TabBarButton from './search/button'
import TabBarSearchInput from './search/Input'
import { styles } from './TabBarContainer.styles'

export default function TabBarContainer() {
  const searchFocused = useTabBarStore((state) => state.searchFocused)
  const search = useTabBarStore((state) => state.search)
  const state = useNavigationState((state) => state)
  const edit = useChatsStore((state) => state.edit)
  const inputRef = useRef<TextInput>(null)
  const scale = useSharedValue(1)
  const x = useSharedValue(0)

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? PRESSABLE_INPUT_SCALE : 1, springy))
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return !edit ? (
    <Animated.View entering={vSlideAnimationIn} exiting={vSlideAnimationOut} style={styles.container}>
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
    </Animated.View>
  ) : (
    <TabBarDelete />
  )
}
