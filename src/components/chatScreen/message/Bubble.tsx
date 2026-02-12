import { messageAnimationIn } from '@constants/animations'
import type { Message } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import { useLayoutEffect } from 'react'
import { Text, View } from 'react-native'
import Animated, { type MeasuredDimensions, measure, type SharedValue, useAnimatedRef } from 'react-native-reanimated'
import { scheduleOnUI } from 'react-native-worklets'
import { styles } from './Message.styles'

interface MessageBubbleProps {
  message: Message | null
  mountFinished: boolean
  shouldAnimate: boolean
  height: SharedValue<number>
  width: SharedValue<number>
}

export default function MessageBubble({ message, mountFinished, shouldAnimate, height, width }: MessageBubbleProps) {
  const animatedRef = useAnimatedRef<View>()
  const isMe: boolean = message?.isMe

  useLayoutEffect(() => {
    if (shouldAnimate) {
      const measureView = (): void => {
        'worklet'
        const measurment: MeasuredDimensions = measure(animatedRef)

        height.set(Math.floor(measurment.height))
        width.set(Math.floor(measurment.width))
      }

      scheduleOnUI(measureView)
    }
  }, [])

  return (
    <Animated.View ref={animatedRef} entering={shouldAnimate ? messageAnimationIn : null} style={[styles.message(isMe, mountFinished)]}>
      <View style={styles.messageContent}>
        <Text style={[styles.text(isMe)]}>
          {message?.content}
          <Text>{'         '}</Text>
        </Text>
        <Animated.Text style={[styles.secondaryText(isMe)]}>{formatSentTime(message?.date)}</Animated.Text>
      </View>
    </Animated.View>
  )
}
