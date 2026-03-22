import { messageAnimationIn, springy } from '@constants/animations'
import type { Message } from '@interfaces'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Message.styles'

interface MessageBubbleProps {
  message: Message | null
  shouldAnimate: boolean
  seen: boolean
}

export default function MessageBubble({ message, seen, shouldAnimate }: MessageBubbleProps) {
  const isMe: boolean = message?.isMe
  const translateX = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.get() }] }))

  useEffect(() => {
    translateX.set(isMe ? withSpring(!seen ? -12 : 0, springy) : 0)
  }, [seen, message.id])

  return (
    <Animated.View entering={shouldAnimate ? messageAnimationIn : null} style={[styles.message(isMe), animatedStyle]}>
      <View style={styles.messageContent}>
        <Text style={[styles.text(isMe)]}>
          {message?.content}
          <View style={styles.timeSpacer} />
        </Text>
        <Animated.Text style={[styles.secondaryText(isMe)]}>{message?.formatted_date}</Animated.Text>
      </View>
    </Animated.View>
  )
}
