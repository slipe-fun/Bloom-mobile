import { GradientBlur } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import { useRef } from 'react'
import type { TextInput } from 'react-native'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Footer.styles'
import FooterSearch from './search'

export const TAB_BAR_HEIGHT = SIZE_MAP.lg

const AnimatedStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer() {
  const insets = useInsets()
  const inputRef = useRef<TextInput>(null)
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()

  const animatedViewStyles = useAnimatedStyle(() => ({
    paddingHorizontal: keyboardProgress.get() > 0.5 ? base.spacing.lg : base.spacing.xxxl,
  }))

  return (
    <AnimatedStickyView offset={{ opened: -base.spacing.lg, closed: -insets.bottom }} style={[styles.container, animatedViewStyles]}>
      <GradientBlur keyboard />
      <FooterSearch ref={inputRef} />
    </AnimatedStickyView>
  )
}
