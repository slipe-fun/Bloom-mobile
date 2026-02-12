import { Button, GradientBlur } from '@components/ui'
import Icon from '@components/ui/Icon'
import { useInsets } from '@hooks'
import type { Message } from '@interfaces'
import type { FlashListRef } from '@shopify/flash-list'
import useChatScreenStore from '@stores/chatScreen'
import { useCallback, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'
import MessageInput from './MessageInput'
import SendButton from './SendButton'

interface FooterProps {
  onSend: (content: string, reply_to: number) => void
  setFooterHeight: (value: number) => void
  footerHeight: number
  listRef: FlashListRef<Message>
}

const AnimatedKeyboardStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer({ onSend, setFooterHeight, footerHeight, listRef }: FooterProps) {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const [inputValue, setInputValue] = useState('')
  const { replyMessage, setReplyMessage } = useChatScreenStore()

  const onFooterLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const newHeight = event.nativeEvent.layout.height

      if (newHeight !== footerHeight) {
        setFooterHeight(newHeight)
      }
    },
    [setFooterHeight],
  )

  const animatedViewStyle = useAnimatedStyle(() => ({
    paddingHorizontal: keyboardProgress.get() > 0.1 ? theme.spacing.lg : theme.spacing.xxxl,
  }))

  const handleSendPress = useCallback(() => {
    const trimmedValue = inputValue.trim()
    if (!trimmedValue) return

    listRef?.prepareForLayoutAnimationRender()
    onSend(trimmedValue, replyMessage?.id)

    setInputValue('')
    if (replyMessage) {
      setReplyMessage(null)
    }
  }, [inputValue, replyMessage, onSend, setReplyMessage])

  return (
    <AnimatedKeyboardStickyView
      offset={{ opened: -theme.spacing.lg, closed: -insets.bottom }}
      onLayout={onFooterLayout}
      style={[styles.footer, animatedViewStyle]}
    >
      <GradientBlur keyboard />
      <Button blur variant="icon">
        <Icon icon="plus" size={26} color={theme.colors.text} />
      </Button>

      <MessageInput setValue={setInputValue} value={inputValue} />
      <SendButton handleSend={handleSendPress} hasValue={inputValue.trim().length > 0} />
    </AnimatedKeyboardStickyView>
  )
}
