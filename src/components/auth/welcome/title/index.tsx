import { charAnimationIn, charAnimationOut, makeLayoutAnimation, quickSpring, springyChar } from '@constants/animations'
import { AUTH_TITLES } from '@constants/titles'
import { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Title.styles'

export default function AuthTitle() {
  const [activeTitle, setActiveTitle] = useState(0)
  const colorProgress = useSharedValue(0)

  const chars = useMemo(() => AUTH_TITLES[activeTitle].title.split(''), [activeTitle])

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      colorProgress.value,
      AUTH_TITLES.map((_, i) => i),
      AUTH_TITLES.map((title) => title.color),
    ),
  }))

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTitle((prev) => (prev + 1) % AUTH_TITLES.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    colorProgress.value = withSpring(activeTitle, quickSpring)
  }, [activeTitle])

  return (
    <View style={styles.titleContainer}>
      {chars.map((char, index) => (
        <Animated.Text
          key={`${char}-${Math.random()}`}
          layout={makeLayoutAnimation(springyChar(1))}
          entering={charAnimationIn(springyChar(index, false), false)}
          exiting={charAnimationOut(springyChar(index, false), false)}
          style={[styles.char, animatedTextStyle]}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  )
}
