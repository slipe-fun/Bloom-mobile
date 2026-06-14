import { Button, GradientBlur } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import Icon from '@components/ui/Icon'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import useChatStore from '@stores/chat'
import { useState } from 'react'
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
  const [height, setHeight] = useState(footerHeight)

  useKeyboardHandler({
    onStart: (e) => {
      'worklet'
      scheduleOnRN(setHeight, footerHeight + e.height)
    },
  })

  const animatedViewStyle = useAnimatedStyle(() => ({
    paddingHorizontal: keyboardProgress.get() > 0.5 ? base.spacing.lg : base.spacing.xxxl,
  }))

  return (
    <AnimatedKeyboardStickyView
      offset={{ opened: -base.spacing.sm - 2, closed: -insets.bottom }}
      style={[styles.footer, animatedViewStyle]}
    >
      <GradientBlur blur={false} style={{ height: height }} behindKeyboard={height > footerHeight} />
      <Button variant="icon">
        <Icon size={24} icon="plus" uniProps={(theme) => ({ color: theme.colors.text })} />
      </Button>

      <MessageInput handleSend={handleSend} />
    </AnimatedKeyboardStickyView>
  )
}
