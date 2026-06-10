import { Button, GradientBlur } from '@components/ui'
import Icon from '@components/ui/Icon'
import { layoutAnimation, quickSpring } from '@constants/animations'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import { useState } from 'react'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { styles } from './Footer.styles'
import MessageInput from './MessageInput'

const AnimatedKeyboardStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer() {
  const insets = useInsets()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const [inputValue, setInputValue] = useState('')

  const animatedViewStyle = useAnimatedStyle(() => ({
    paddingHorizontal: withSpring(keyboardProgress.get() > 0.1 ? base.spacing.lg : base.spacing.xxxl, quickSpring),
  }))

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

      <MessageInput setValue={setInputValue} value={inputValue} />
    </AnimatedKeyboardStickyView>
  )
}
