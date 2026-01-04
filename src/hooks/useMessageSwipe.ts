import { quickSpring } from '@constants/easings'
import { useCallback } from 'react'
import { Gesture } from 'react-native-gesture-handler'
import { Haptics } from 'react-native-nitro-haptics'
import { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

type Config = {
  menuWidth: number
  replyThreshold: number
  onReply?: () => void
}

export default function useMessageSwipe({ menuWidth, replyThreshold, onReply }: Config) {
  const translateX = useSharedValue(0)
  const startX = useSharedValue(0)

  const triggerHaptic = useCallback(() => {
    Haptics.impact('light')
  }, [])

  useAnimatedReaction(
    () => translateX.value <= -replyThreshold,
    (v, prev) => {
      if (v && !prev) {
        runOnJS(triggerHaptic)()
      }
    },
  )

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      startX.value = translateX.value
    })
    .onUpdate((e) => {
      translateX.value = Math.min(e.translationX + startX.value, 0)
    })
    .onEnd(() => {
      if (translateX.value <= -replyThreshold) {
        runOnJS(onReply ?? (() => {}))()
        translateX.value = withSpring(0, quickSpring)
      } else if (translateX.value <= -menuWidth / 2) {
        translateX.value = withSpring(-menuWidth, quickSpring)
      } else {
        translateX.value = withSpring(0, quickSpring)
      }
    })

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      if (translateX.value === 0) {
        runOnJS(triggerHaptic)()
        translateX.value = withSpring(-menuWidth, quickSpring)
      }
    })

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (translateX.value !== 0) {
      translateX.value = withSpring(0, quickSpring)
    }
  })

  const gesture = Gesture.Simultaneous(panGesture, longPressGesture, tapGesture)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return {
    gesture,
    animatedStyle,
    translateX,
  }
}
