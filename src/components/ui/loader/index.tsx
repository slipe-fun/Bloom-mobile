import { LoaderAnimationIn, LoaderAnimationOut, springy } from '@constants/animations'
import { useEffect, useState } from 'react'
import type { ViewStyle } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Loader.styles'

interface Bar {
  index: number
  progress: number
  radius: number
  segments: number
  color?: string
}

interface Loader {
  interval?: number
  size?: number
  segments?: number
  color?: string
  ref?: React.Ref<any>
}

export default function Loader({ interval = 85, size = 26, segments = 8, color, ref }: Loader) {
  const [progress, setProgress] = useState(0)

  const radius = size / 2.83

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => (prev >= segments - 1 ? 0 : prev + 1))
    }, interval)

    return () => clearInterval(id)
  }, [])

  return (
    <Animated.View entering={LoaderAnimationIn} exiting={LoaderAnimationOut} ref={ref} style={styles.container(size)}>
      {Array.from({ length: segments }, (_, i) => i).map((i) => (
        <Bar key={i} index={i} progress={progress} radius={radius} segments={segments} color={color} />
      ))}
    </Animated.View>
  )
}

function Bar({ index, progress, radius, segments, color }: Bar) {
  const animationProgress = useSharedValue(0)

  const animatedViewStyles = useAnimatedStyle((): ViewStyle => {
    const scale = interpolate(animationProgress.get(), [0, 1], [1, 1.4])
    const opacity = interpolate(animationProgress.get(), [0, 1], [0.5, 1])

    return {
      transform: [{ rotate: `${(index * 360) / segments}deg` }, { translateY: -radius }, { scale }],
      opacity,
    }
  }, [progress, index])

  useEffect(() => {
    animationProgress.set(withSpring(index === progress ? 1 : 0, springy))
  }, [progress, index])

  return <Animated.View style={[styles.bar(color, radius), animatedViewStyles]} />
}
