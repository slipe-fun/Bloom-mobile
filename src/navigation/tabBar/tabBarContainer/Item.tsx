import Icon from '@components/ui/Icon'
import { quickSpring } from '@constants/easings'
import { TAB_COLORS, TAB_ICONS } from '@constants/tabBar'
import type { TabValue } from '@interfaces'
import type React from 'react'
import { useCallback, useEffect } from 'react'
import { Pressable, type ViewStyle } from 'react-native'
import { Haptics } from 'react-native-nitro-haptics'
import Animated, { interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './TabBarContainer.styles'

type TabBarItemProps = {
  route: { name: TabValue; key: string }
  focused: boolean
  navigation: any
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function TabBarItem({ route, focused, navigation }: TabBarItemProps): React.JSX.Element {
  const { theme } = useUnistyles()
  const color = useSharedValue(0)
  const scale = useSharedValue(1)

  const TAB_COLORS_RES = TAB_COLORS()

  const iconScale = (out: boolean = false) => {
    scale.value = withSpring(out ? 1 : 1.2, quickSpring)
  }

  const onPress = useCallback(() => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })

    if (!focused && !event.defaultPrevented) {
      Haptics.impact('light')
      navigation.navigate(route.name)
    }
  }, [focused])

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [
        {
          scale: scale.value,
        },
      ],
      opacity: withSpring(focused ? 1 : theme.opacity.contentText, quickSpring),
    }),
  )

  const animatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(color.value, [0, 1], [theme.colors.text, TAB_COLORS_RES[route.name]]),
  }))

  useEffect(() => {
    color.value = withSpring(focused ? 1 : 0, quickSpring)
  }, [focused])

  return (
    <AnimatedPressable
      style={[styles.tabBarItem, animatedStyle]}
      onPress={() => onPress()}
      onPressIn={() => iconScale()}
      onPressOut={() => iconScale(true)}
    >
      <Icon animatedProps={animatedProps} size={30} icon={TAB_ICONS[route.name]} />
    </AnimatedPressable>
  )
}
