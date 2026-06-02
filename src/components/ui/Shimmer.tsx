import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { View } from 'react-native'
import Animated, { Easing, interpolate, type SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

export interface ShimmerRef {
  play?: () => void
}

export interface ShimmerDropInProps {
  borderRadius?: number
  borderWidth?: number
  autoPlay?: boolean
  delay?: number
  ref?: ShimmerRef
}

function MovingGradient({ opacity, progress }: { opacity: number; progress: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: `${interpolate(progress.get(), [0, 1], [-100, 100])}%` as any,
        },
      ],
    }
  })
  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle, { width: '200%', left: '-50%', opacity }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        locations={[0.4, 0.5, 0.6]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  )
}

export default function Shimmer({ borderRadius = 12, borderWidth = 2, autoPlay = true, delay = 2500, ref }) {
  const progress = useSharedValue(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const triggerShimmer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    progress.set(0)

    progress.set(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.linear) }, (finished) => {
        if (finished && autoPlay) {
          scheduleOnRN(scheduleNext)
        }
      }),
    )
  }, [autoPlay, progress])

  const scheduleNext = useCallback(() => {
    //@ts-expect-error
    timeoutRef.current = setTimeout(() => {
      triggerShimmer()
    }, delay)
  }, [triggerShimmer, delay])

  useImperativeHandle(ref, () => ({
    play: triggerShimmer,
  }))

  useEffect(() => {
    if (autoPlay) {
      triggerShimmer()
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [autoPlay, triggerShimmer])

  return (
    <View style={[StyleSheet.absoluteFill, { borderRadius, borderCurve: 'continuous', overflow: 'hidden' }]} pointerEvents="none">
      <MovingGradient progress={progress} opacity={0.2} />
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <View style={[StyleSheet.absoluteFill, { borderWidth, borderColor: 'white', borderRadius, borderCurve: 'continuous' }]} />
        }
      >
        <MovingGradient progress={progress} opacity={1} />
      </MaskedView>
    </View>
  )
}
