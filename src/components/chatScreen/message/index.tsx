import { quickSpring, springy } from '@constants/animations'
import { base } from '@design/base'
import type { Message as MessageType } from '@interfaces'
import useChatStore from '@stores/chat'
import { useEffect, useMemo } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Haptics } from 'react-native-nitro-haptics'
import { NitroModules } from 'react-native-nitro-modules'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import MessageBubble from './Bubble'
import { styles } from './Message.styles'
import StatusBubble, { SWIPE_THRESHOLD } from './StatusBubble'

interface MessageProps {
  message: MessageType | null
  seen: boolean
  marginBottom: number
  shouldAnimate: boolean
  reply: boolean
}

const hapticsBox = NitroModules.box(Haptics)

export default function Message({ message, seen, marginBottom, shouldAnimate, reply }: MessageProps) {
  const swipeX = useSharedValue(0)
  const hapticTriggered = useSharedValue(false)
  const opacity = useSharedValue(0)

  const setReplyMessage = useChatStore((state) => state.setReplyMessage)

  const isMe = message?.isMe ?? false

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
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
          } else if (x > 0) {
            swipeX.set(x * 0.125)
          } else {
            swipeX.set(x)
          }
        })
        .onEnd(() => {
          if (hapticTriggered.get()) {
            scheduleOnRN(setReplyMessage, message.id)
            hapticTriggered.set(false)
          }
          swipeX.set(withSpring(0, springy))
        }),
    [],
  )

  const animatedMessageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: swipeX.get() }],
      opacity: opacity.get(),
    }
  })

  useEffect(() => {
    opacity.set(withSpring(reply ? base.opacity.contentText : 1, quickSpring))
  }, [reply, message.id])

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.messageWrapper(isMe, marginBottom), animatedMessageStyle]}>
        <StatusBubble hapticsTriggered={hapticTriggered} isMe={isMe} seen={seen} swipeX={swipeX} />
        <MessageBubble message={message} seen={seen} shouldAnimate={shouldAnimate} />
      </Animated.View>
    </GestureDetector>
  )
}
