import { Button, GradientBlur } from '@components/ui'
import Icon from '@components/ui/Icon'
import { layoutAnimation, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { useInsets } from '@hooks'
import { useCallback, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'
import MessageInput from './MessageInput'
import SendButton from './SendButton'

type FooterProps = {
  onSend: (content: string, reply_to: number) => void
  setFooterHeight: (value: number) => void
  footerHeight: number
}

const AnimatedKeyboardStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer({ onSend, setFooterHeight, footerHeight }: FooterProps) {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const [value, setValue] = useState<string>('')

  const onFooterLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setFooterHeight(event.nativeEvent.layout.height)
    },
    [footerHeight, setFooterHeight],
  )

  const animatedViewStyle = useAnimatedStyle(() => ({
    paddingHorizontal: keyboardProgress.get() > 0.1 ? theme.spacing.lg : theme.spacing.xxxl,
  }))

  return (
    <AnimatedKeyboardStickyView
      layout={layoutAnimation}
      offset={{ opened: -theme.spacing.lg, closed: -insets.bottom }}
      onLayout={onFooterLayout}
      style={[styles.footer, animatedViewStyle]}
    >
      <GradientBlur keyboard />
      <Button layout={layoutAnimation} blur exiting={zoomAnimationOut} entering={zoomAnimationIn} variant="icon">
        <Icon icon="plus" size={26} color={theme.colors.text} />
      </Button>

      <MessageInput setValue={setValue} value={value} />
      <SendButton value={value} onSend={onSend} setValue={setValue} />
    </AnimatedKeyboardStickyView>
  )
}
