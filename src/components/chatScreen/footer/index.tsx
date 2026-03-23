import { Button, GradientBlur } from '@components/ui'
import Icon from '@components/ui/Icon'
import { layoutAnimation } from '@constants/animations'
import { useInsets } from '@hooks'
import type { Message } from '@interfaces'
import type { FlashListRef } from '@shopify/flash-list'
import useChatStore from '@stores/chat'
import { useCallback, useState } from 'react'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'
import MessageInput from './MessageInput'
import SendButton from './SendButton'

interface FooterProps {
  onSend: (content: string, reply_to: number) => void
  footerHeight: SharedValue<number>
  listRef: FlashListRef<Message>
}

const AnimatedKeyboardStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer({ onSend, footerHeight, listRef }: FooterProps) {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const [inputValue, setInputValue] = useState('')
  const replyMessage = useChatStore((state) => state.replyMessage)
  const setReplyMessage = useChatStore((state) => state.setReplyMessage)

  const animatedViewStyle = useAnimatedStyle(() => ({
    // paddingHorizontal: withSpring(keyboardProgress.get() > 0.1 ? theme.spacing.lg : theme.spacing.xxxl, quickSpring),
    paddingHorizontal: interpolate(keyboardProgress.get(), [0, 1], [theme.spacing.xxxl, theme.spacing.lg]),
  }))

  const handleSendPress = useCallback(() => {
    const trimmedValue = inputValue.trim()
    if (!trimmedValue) return

    listRef?.prepareForLayoutAnimationRender()
    onSend(trimmedValue, replyMessage)

    setInputValue('')
    if (replyMessage) {
      setReplyMessage(null)
    }
  }, [inputValue, replyMessage, onSend, setReplyMessage])

  return (
    <AnimatedKeyboardStickyView
      offset={{ opened: -theme.spacing.sm - 2, closed: -insets.bottom }}
      layout={layoutAnimation}
      style={[styles.footer, animatedViewStyle]}
    >
      <GradientBlur keyboard />
      <Button layout={layoutAnimation} variant="icon">
        <Icon icon="plus" color={theme.colors.text} />
      </Button>

      <MessageInput footerHeight={footerHeight} setValue={setInputValue} value={inputValue} />
      <SendButton handleSend={handleSendPress} hasValue={inputValue.trim().length > 0} />
    </AnimatedKeyboardStickyView>
  )
}
