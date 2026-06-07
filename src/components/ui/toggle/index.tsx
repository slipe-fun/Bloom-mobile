import { springy } from '@constants/animations'
import { base } from '@design/base'
import { useEffect } from 'react'
import { View, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Haptics } from 'react-native-nitro-haptics'
import { NitroModules } from 'react-native-nitro-modules'
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { styles } from './Toggle.styles'

const TRACK_WIDTH = 66
const TRACK_HEIGHT = 30
const PADDING = base.spacing.xxs
const THUMB_WIDTH = 38
const THUMB_HEIGHT = TRACK_HEIGHT - PADDING * 2
const BASE_TRAVEL = TRACK_WIDTH - THUMB_WIDTH - PADDING * 2

const haptics = NitroModules.box(Haptics)

interface ToggleProps {
  value: boolean
  onValueChange: (newValue: boolean) => void
}

export default function Toggle({ value, onValueChange }: ToggleProps) {
  const theme = useAnimatedTheme()
  const isToggled = useSharedValue(value)
  const isCrossed = useSharedValue(value)
  const progress = useSharedValue(value ? 1 : 0)
  const colorProgress = useSharedValue(value ? 1 : 0)
  const startProgress = useSharedValue(0)
  const pressFactor = useSharedValue(0)

  const animateTo = (nextVal: boolean) => {
    'worklet'
    isToggled.set(nextVal)
    isCrossed.set(nextVal)
    const target = nextVal ? 1 : 0
    progress.set(withSpring(target, springy))
    colorProgress.set(withSpring(target, springy))
  }

  useEffect(() => {
    animateTo(value)
  }, [value])

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressFactor.set(withSpring(1, springy))
    })
    .onEnd(() => {
      const newValue = !isToggled.get
      animateTo(newValue)
      haptics.unbox().impact('light')
    })
    .onFinalize(() => {
      pressFactor.set(withSpring(0, springy))
    })

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressFactor.set(withSpring(1, springy))
    })
    .onStart(() => {
      startProgress.set(progress.get())
    })
    .onUpdate((event) => {
      const rawProgress = startProgress.get() + event.translationX / BASE_TRAVEL

      let rubberProgress = rawProgress
      if (rawProgress < 0) {
        rubberProgress = Math.max(-0.2, rawProgress * 0.25)
      } else if (rawProgress > 1) {
        rubberProgress = Math.min(1.2, 1 + (rawProgress - 1) * 0.25)
      }

      progress.set(rubberProgress)

      const crossedRight = rubberProgress > 0.5
      if (isCrossed.get() !== crossedRight) {
        isCrossed.set(crossedRight)
        colorProgress.set(withSpring(crossedRight ? 1 : 0, springy))
        haptics.unbox().impact('light')
      }
    })
    .onEnd(() => {
      const newValue = progress.get() > 0.5
      animateTo(newValue)

      if (newValue !== value) {
        scheduleOnRN(onValueChange, newValue)
      }
    })
    .onFinalize(() => {
      pressFactor.set(withSpring(0, springy))
    })

  const gesture = Gesture.Exclusive(pan, tap)

  const animatedTrackStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(colorProgress.get(), [0, 1], [theme.get().colors.switcher, theme.get().colors.primary]),
    }),
    [theme],
  )

  const animatedThumbStyle = useAnimatedStyle((): ViewStyle => {
    const scale = interpolate(pressFactor.get(), [0, 1], [1, 1.25])
    const translateX = interpolate(progress.get(), [0, 1], [0, BASE_TRAVEL])

    return {
      transform: [{ translateX }, { scale }],
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.track(TRACK_HEIGHT, TRACK_WIDTH), animatedTrackStyle]}>
          <Animated.View style={[styles.thumb(THUMB_HEIGHT, THUMB_WIDTH), animatedThumbStyle]} />
        </Animated.View>
      </View>
    </GestureDetector>
  )
}
