import { springy } from '@constants/animations'
import type { Message as MessageType } from '@interfaces'
import { Pressable } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Haptics } from 'react-native-nitro-haptics'
import { NitroModules } from 'react-native-nitro-modules'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import MessageBubble from './Bubble'
import { styles } from './Message.styles'
import StatusBubble, { SWIPE_THRESHOLD } from './StatusBubble'

interface MessageProps {
  message: MessageType | null
  seen: boolean
  marginBottom: number
  shouldAnimate: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const hapticsBox = NitroModules.box(Haptics)

export default function Message({ message, seen, marginBottom, shouldAnimate }: MessageProps) {
  const swipeX = useSharedValue(0)
  const hapticTriggered = useSharedValue(false)

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10000])
    .failOffsetX([-10000, 5])
    .onStart(() => {
      hapticTriggered.set(false)
    })
    .onUpdate((event) => {
      const x = event.translationX

      if (x < SWIPE_THRESHOLD) {
        swipeX.set(SWIPE_THRESHOLD + (x - SWIPE_THRESHOLD) * 0.125)

        if (!hapticTriggered.get()) {
          hapticsBox.unbox().impact('heavy')
          hapticTriggered.set(true)
        }
      } else {
        swipeX.set(x)
      }
    })
    .onEnd(() => {
      hapticTriggered.set(false)
      swipeX.set(withSpring(0, springy))
    })

  const animatedMessageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: swipeX.get() }],
    }
  })

  const isMe = message?.isMe ?? false

  return (
    <GestureDetector gesture={panGesture}>
      <AnimatedPressable style={[styles.messageWrapper(isMe, marginBottom), animatedMessageStyle]}>
        <StatusBubble hapticsTriggered={hapticTriggered} isMe={isMe} seen={seen} swipeX={swipeX} />
        <MessageBubble message={message} seen={seen} shouldAnimate={shouldAnimate} />
      </AnimatedPressable>
    </GestureDetector>
  )
}
