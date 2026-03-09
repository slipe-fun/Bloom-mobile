import { Icon } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimationSpringy, springy } from '@constants/animations'
import { useEffect } from 'react'
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './header.styles'

export default function Title({ state }) {
  const theme = useAnimatedTheme()
  const color = useSharedValue(0)
  const rotation = useSharedValue(0)

  const startRotation = () => {
    rotation.set(withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1, false))
  }

  const stopRotation = () => {
    cancelAnimation(rotation)
    rotation.set(withSpring(0, springy))
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.get()}deg` }],
    }
  })

  const animatedProps = useAnimatedProps(() => {
    return {
      fill: interpolateColor(color.get(), [0, 1], [theme.value.colors.primary, theme.value.colors.yellow]),
    }
  })

  useEffect(() => {
    if (state !== 'connected') {
      color.set(withSpring(1, springy))
      startRotation()
    } else {
      color.set(withSpring(0, springy))
      stopRotation()
    }
  }, [state])

  return (
    <Animated.View key="connected" layout={layoutAnimationSpringy} style={styles.container}>
      <Animated.View style={animatedStyle} layout={layoutAnimationSpringy}>
        <Icon animatedProps={animatedProps} icon="logo" size={28} />
      </Animated.View>

      {state !== 'connecting' ? (
        <Animated.Text key="connected" layout={layoutAnimationSpringy} entering={getFadeIn()} exiting={getFadeOut()} style={styles.text}>
          Bloom
        </Animated.Text>
      ) : (
        <Animated.Text key="connecting" layout={layoutAnimationSpringy} entering={getFadeIn()} exiting={getFadeOut()} style={styles.text}>
          Подкл...
        </Animated.Text>
      )}
    </Animated.View>
  )
}
