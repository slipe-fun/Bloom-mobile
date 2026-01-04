import { getCharEnter, getCharExit, layoutAnimationSpringy, springyChar } from '@constants/animations'
import { AUTH_TITLES } from '@constants/titles'
import type React from 'react'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { styles } from './Title.styles'

export default function AuthTitle(): React.JSX.Element {
  const [activeTitle, setActiveTitle] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTitle((prev) => (prev + 1) % AUTH_TITLES.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const chars = AUTH_TITLES[activeTitle].title.split('')

  return (
    <View style={styles.titleContainer}>
      {chars.map((char, index) => (
        <Animated.Text
          key={`${char}-${Math.random()}`}
          layout={layoutAnimationSpringy}
          entering={getCharEnter(springyChar(index))}
          exiting={getCharExit(springyChar(index))}
          style={styles.char}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  )
}
