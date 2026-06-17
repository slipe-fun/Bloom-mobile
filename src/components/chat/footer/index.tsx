import { Button, GradientBlur } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import Icon from '@components/ui/Icon'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import useChatStore from '@stores/chat'
import { useEffect, useState } from 'react'
import { KeyboardStickyView, useKeyboardHandler, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { styles } from './Footer.styles'
import MessageInput from './MessageInput'

export const FOOTER_HEIGHT = SIZE_MAP.md + base.spacing.xxl

const AnimatedKeyboardStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer({ handleSend }) {
  const insets = useInsets()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const footerHeight = useChatStore((state) => state.footerHeight)
  const [height, setHeight] = useState(0)
  const [gradientHeight, setGradientHeight] = useState(0)

  useKeyboardHandler({
    onStart: (e) => {
      'worklet'
      scheduleOnRN(setHeight, e.height)
    },
  })

  const animatedViewStyle = useAnimatedStyle(() => ({
    paddingHorizontal: keyboardProgress.get() > 0.5 ? base.spacing.lg : base.spacing.xxxl,
  }))

  useEffect(() => {
    setGradientHeight(height + footerHeight)
  }, [height, footerHeight])

  return (
    <AnimatedKeyboardStickyView
      offset={{ opened: -base.spacing.sm - 2, closed: -insets.bottom }}
      style={[styles.footer, animatedViewStyle]}
    >
      <GradientBlur blur={false} style={{ height: gradientHeight }} behindKeyboard={height > footerHeight} />
      <Button variant="icon">
        <Icon size={24} icon="plus" uniProps={(theme) => ({ color: theme.colors.text })} />
      </Button>

      <MessageInput handleSend={handleSend} />
    </AnimatedKeyboardStickyView>
  )
}
