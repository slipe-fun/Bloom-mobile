import { Icon, Input } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimation, quickSpring, springy } from '@constants/animations'
import { PRESSABLE_INPUT_SCALE } from '@constants/animations/values'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type { Chat } from '@interfaces'
import useChatStore from '@stores/chat'
import { useCallback } from 'react'
import { type LayoutChangeEvent, Pressable, Text } from 'react-native'
import Animated, { type SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'

type MessageInputProps = {
  setValue: (value: string) => void
  value: string
  footerHeight: SharedValue<number>
  recipient: Chat['recipient']
}

const AnimatedInput = Animated.createAnimatedComponent(Input)

export default function MessageInput({ setValue, value, footerHeight, recipient }: MessageInputProps) {
  const replyMessage = useChatStore((state) => state.replyMessage)
  const setReplyMessage = useChatStore((state) => state.setReplyMessage)
  const insets = useInsets()
  const { theme } = useUnistyles()
  const scale = useSharedValue(1)

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height

      footerHeight.set(withSpring(height + insets.bottom + base.spacing.md, quickSpring))
    },
    [footerHeight],
  )

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? PRESSABLE_INPUT_SCALE : 1, springy))
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return (
    <Animated.View
      onTouchStart={() => handlePress(true)}
      onTouchEnd={() => handlePress(false)}
      onLayout={onInputLayout}
      layout={layoutAnimation}
      style={[styles.messageInputWrapper, animatedStyle]}
    >
      {replyMessage ? (
        <Animated.View layout={layoutAnimation} entering={getFadeIn()} exiting={getFadeOut()} style={styles.replyBlockWrapper}>
          <Pressable style={styles.replyBlock}>
            <Text numberOfLines={1} style={styles.replyText}>
              В ответ <Text style={styles.replyRecipient}>{recipient.display_name || recipient.username}</Text>
            </Text>
            <Pressable style={styles.replyCancel} onPress={() => setReplyMessage(null)}>
              <Icon size={16} icon="x" color={theme.colors.secondaryText} />
            </Pressable>
          </Pressable>
        </Animated.View>
      ) : null}

      <AnimatedInput
        basic
        layout={layoutAnimation}
        numberOfLines={7}
        onChangeText={setValue}
        multiline
        submitBehavior="newline"
        size="md"
        returnKeyType="previous"
        value={value}
        placeholder="Cообщение..."
      />
    </Animated.View>
  )
}
