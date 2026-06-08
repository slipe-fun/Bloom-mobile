import { quickSpring, springy } from '@constants/animations'
import { base } from '@design/base'
import { View } from 'react-native'
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
  onToggle: () => void
}

export default function Toggle({ value, onToggle }: ToggleProps) {
  const theme = useAnimatedTheme()
  const isToggled = useSharedValue(value)
  const isCrossed = useSharedValue(value)
  const progress = useSharedValue(value ? 1 : 0)
  const colorProgress = useSharedValue(value ? 1 : 0)
  const startProgress = useSharedValue(0)
  const pressFactor = useSharedValue(0)

  const triggerToggleWithDelay = () => {
    onToggle?.()
  }

  const animateTo = (nextVal: boolean) => {
    'worklet'
    isToggled.value = nextVal
    isCrossed.value = nextVal
    const target = nextVal ? 1 : 0
    progress.value = withSpring(target, springy)
    colorProgress.value = withSpring(target, quickSpring, (finished) => {
      finished && scheduleOnRN(triggerToggleWithDelay)
    })
  }

  const onPressBegin = () => {
    'worklet'
    pressFactor.value = withSpring(1, springy)
  }
  const onPressFinalize = () => {
    'worklet'
    pressFactor.value = withSpring(0, springy)
  }

  const tap = Gesture.Tap()
    .onBegin(onPressBegin)
    .onEnd(() => {
      animateTo(!isToggled.value)
      haptics.unbox().impact('light')
    })
    .onFinalize(onPressFinalize)

  const pan = Gesture.Pan()
    .onBegin(onPressBegin)
    .onStart(() => {
      startProgress.value = progress.value
    })
    .onUpdate((event) => {
      const rawProgress = startProgress.value + event.translationX / BASE_TRAVEL

      const rubberProgress =
        rawProgress < 0 ? Math.max(-0.2, rawProgress * 0.25) : rawProgress > 1 ? Math.min(1.2, 1 + (rawProgress - 1) * 0.25) : rawProgress

      progress.value = rubberProgress

      const crossedRight = rubberProgress > 0.5
      if (isCrossed.value !== crossedRight) {
        isCrossed.value = crossedRight
        colorProgress.value = withSpring(crossedRight ? 1 : 0, springy)
        haptics.unbox().impact('light')
      }
    })
    .onEnd(() => {
      animateTo(progress.value > 0.5)
    })
    .onFinalize(onPressFinalize)

  const gesture = Gesture.Exclusive(pan, tap)

  const animatedTrackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorProgress.value, [0, 1], [theme.value.colors.switcher, theme.value.colors.primary]),
  }))

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, BASE_TRAVEL]) },
      { scale: interpolate(pressFactor.value, [0, 1], [1, 1.25]) },
    ],
  }))

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
