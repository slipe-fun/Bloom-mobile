import { Button, GradientBlur } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import Icon from '@components/ui/Icon'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import { useState } from 'react'
import { KeyboardStickyView, useKeyboardHandler, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { styles } from './Footer.styles'
import MessageInput from './MessageInput'

export const FOOTER_HEIGHT = SIZE_MAP.lg + base.spacing.xxl

const AnimatedKeyboardStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer() {
  const insets = useInsets()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const [inputValue, setInputValue] = useState('')
  const calculatedFooter = FOOTER_HEIGHT + insets.bottom
  const [height, setHeight] = useState(calculatedFooter)

  useKeyboardHandler({
    onStart: (e) => {
      'worklet'
      scheduleOnRN(setHeight, calculatedFooter + e.height)
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
      <GradientBlur blur={false} style={{ height: height }} behindKeyboard={height > calculatedFooter} />
      <Button variant="icon">
        <Icon icon="plus" uniProps={(theme) => ({ color: theme.colors.text })} />
      </Button>

      <MessageInput setValue={setInputValue} value={inputValue} />
    </AnimatedKeyboardStickyView>
  )
}
