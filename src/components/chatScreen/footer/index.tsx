import { Button, GradientBlur } from '@components/ui'
import Icon from '@components/ui/Icon'
import { layoutAnimation } from '@constants/animations'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type { Member, Message } from '@interfaces'
import type { FlashListRef } from '@shopify/flash-list'
import { useCallback, useState } from 'react'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Footer.styles'
import MessageInput from './MessageInput'
import SendButton from './SendButton'

interface FooterProps {
  onSend: (content: string, reply_to: number) => void
  footerHeight: SharedValue<number>
  listRef: FlashListRef<Message>
  recipient: Member
}

const AnimatedKeyboardStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer({ onSend, footerHeight, listRef, recipient }: FooterProps) {
  const insets = useInsets()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const [inputValue, setInputValue] = useState('')

  const animatedViewStyle = useAnimatedStyle(() => ({
    // paddingHorizontal: withSpring(keyboardProgress.get() > 0.1 ? theme.spacing.lg : theme.spacing.xxxl, quickSpring),
    paddingHorizontal: interpolate(keyboardProgress.get(), [0, 1], [theme.spacing.xxxl, theme.spacing.lg]),
  }))

  const handleSendPress = useCallback(() => {
    const trimmedValue = inputValue.trim()
    if (!trimmedValue) return

    listRef?.prepareForLayoutAnimationRender()
    onSend(trimmedValue, 1)

    setInputValue('')
  }, [inputValue, onSend])

  return (
    <AnimatedKeyboardStickyView
      offset={{ opened: -base.spacing.sm - 2, closed: -insets.bottom }}
      layout={layoutAnimation}
      style={[styles.footer, animatedViewStyle]}
    >
      <GradientBlur />
      <Button layout={layoutAnimation} variant="icon">
        <Icon icon="plus" uniProps={(theme) => ({ color: theme.colors.text })} />
      </Button>

      <MessageInput recipient={recipient} footerHeight={footerHeight} setValue={setInputValue} value={inputValue} />
      <SendButton handleSend={handleSendPress} hasValue={inputValue.trim().length > 0} />
    </AnimatedKeyboardStickyView>
  )
}
