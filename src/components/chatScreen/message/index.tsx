import { springy } from '@constants/animations'
import type { Message as MessageType } from '@interfaces'
import { Pressable } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Haptics } from 'react-native-nitro-haptics'
import { NitroModules } from 'react-native-nitro-modules'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import MessageBubble from './Bubble'
import { styles } from './Message.styles'
import StatusBubble from './StatusBubble'

interface MessageProps {
  message: MessageType | null
  seen: boolean
  marginBottom: number
  shouldAnimate: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Message({ message, seen, marginBottom, shouldAnimate }: MessageProps) {
  const swipeX = useSharedValue(0)
  const hapticTriggered = useSharedValue(false)

  const boxed = NitroModules.box(Haptics)

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      hapticTriggered.set(false)
    })
    .onUpdate((event) => {
      'worklet'
      const x = event.translationX

      if (x < -60) {
        swipeX.set(-60 + (x + 60) * 0.125)

        if (!hapticTriggered.get()) {
          boxed.unbox().impact('heavy')
          hapticTriggered.set(true)
        }
      } else if (x > 0) {
        swipeX.set(x * 0.125)
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

  return (
    <GestureDetector gesture={panGesture}>
      <AnimatedPressable style={[styles.messageWrapper(message?.isMe, marginBottom), animatedMessageStyle]}>
        <StatusBubble hapticsTriggered={hapticTriggered} isMe={message?.isMe} seen={seen} swipeX={swipeX} />
        <MessageBubble message={message} seen={seen} shouldAnimate={shouldAnimate} />
      </AnimatedPressable>
    </GestureDetector>
  )
}
