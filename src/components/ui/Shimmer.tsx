import { quickSpring } from '@constants/easings'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

export interface ShimmerRef {
  play: () => void
}

export interface ShimmerDropInProps {
  borderRadius?: number
  borderWidth?: number
  autoPlay?: boolean
  delay?: number
  ref?: ShimmerRef
}

export default function Shimmer({ borderRadius = 12, borderWidth = 2, autoPlay = true, delay = 2000, ref }) {
  const progress = useSharedValue(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const triggerShimmer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    progress.set(0)

    progress.set(
      withSpring(1, quickSpring, (finished) => {
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: `${interpolate(progress.get(), [0, 1], [-100, 100])}%` as any,
        },
      ],
    }
  })

  useEffect(() => {
    if (autoPlay) {
      triggerShimmer()
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [autoPlay, triggerShimmer])

  const MovingGradient = ({ opacity }: { opacity: number }) => (
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

  return (
    <View style={[StyleSheet.absoluteFill, { borderRadius, borderCurve: 'continuous', overflow: 'hidden' }]} pointerEvents="none">
      <MovingGradient opacity={0.2} />
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <View style={[StyleSheet.absoluteFill, { borderWidth, borderColor: 'white', borderRadius, borderCurve: 'continuous' }]} />
        }
      >
        <MovingGradient opacity={1} />
      </MaskedView>
    </View>
  )
}
