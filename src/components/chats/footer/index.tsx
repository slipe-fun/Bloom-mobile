import { GradientBlur } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import { useRef, useState } from 'react'
import type { TextInput } from 'react-native'
import { KeyboardStickyView, useKeyboardHandler, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import FooterAvatar from './avatar'
import { styles } from './Footer.styles'
import FooterSearch from './Search'

export const FOOTER_HEIGHT = SIZE_MAP.lg + base.spacing.xxl

const AnimatedStickyView = Animated.createAnimatedComponent(KeyboardStickyView)

export default function Footer() {
  const insets = useInsets()
  const inputRef = useRef<TextInput>(null)
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const calculatedFooter = FOOTER_HEIGHT + insets.bottom
  const [height, setHeight] = useState(calculatedFooter)

  useKeyboardHandler({
    onStart: (e) => {
      'worklet'
      scheduleOnRN(setHeight, calculatedFooter + e.height)
    },
  })

  const animatedViewStyles = useAnimatedStyle(() => ({
    paddingHorizontal: keyboardProgress.get() > 0.5 ? base.spacing.lg : base.spacing.xxxl,
  }))

  return (
    <AnimatedStickyView offset={{ opened: -base.spacing.lg, closed: -insets.bottom }} style={[styles.container, animatedViewStyles]}>
      <GradientBlur style={{ height: height }} keyboard behindKeyboard={height > calculatedFooter} />
      <FooterSearch ref={inputRef} />
      <FooterAvatar inputRef={inputRef} />
    </AnimatedStickyView>
  )
}
