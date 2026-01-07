import { quickSpring } from '@constants/easings'
import type React from 'react'
import { useEffect, useState } from 'react'
import { View, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { styles } from './Loader.styles'

type BarProps = {
  index: number
  progress: number
  radius: number
  segments: number
  color?: string
}

type LoaderProps = {
  interval?: number
  size?: number
  segments?: number
  color?: string
}

export default function Loader({ interval = 125, size = 26, segments = 8, color }: LoaderProps) {
  const [progress, setProgress] = useState(0)

  const radius = size / 2.83

  useEffect(() => {
    setInterval(() => {
      setProgress((prev) => (prev >= segments - 1 ? 0 : prev + 1))
    }, interval)
  }, [])

  return (
    <View style={styles.container(size)}>
      {Array.from({ length: segments }, (_, i) => i).map((i) => (
        <Bar key={i} index={i} progress={progress} radius={radius} segments={segments} color={color} />
      ))}
    </View>
  )
}

function Bar({ index, progress, radius, segments, color }: BarProps): React.JSX.Element {
  const animatedViewStyles = useAnimatedStyle((): ViewStyle => {
    const scaleY = withSpring(index === progress ? 1.25 : 1, quickSpring)
    const opacity = withSpring(index === progress ? 1 : 0.35, quickSpring)
    const translateY = withSpring(index === progress ? -radius - 1 : -radius)

    return {
      transform: [{ rotate: `${(index * 360) / segments}deg` }, { translateY }, { scaleY }],
      opacity,
    }
  }, [progress])

  return <Animated.View style={[styles.bar(color), animatedViewStyles]} />
}
