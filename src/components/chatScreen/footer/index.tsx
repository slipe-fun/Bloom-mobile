import { Button, GradientBlur } from '@components/ui'
import Icon from '@components/ui/Icon'
import {
  layoutAnimationSpringy,
  paperplaneAnimationIn,
  paperplaneAnimationOut,
  zoomAnimationIn,
  zoomAnimationOut,
} from '@constants/animations'
import { useInsets } from '@hooks'
import useChatScreenStore from '@stores/chatScreen'
import { useCallback, useState } from 'react'
import type { LayoutChangeEvent, ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'
import MessageInput from './MessageInput'

type FooterProps = {
  onSend: (content: string, reply_to: number) => void
  setFooterHeight: (value: number) => void
  footerHeight: number
}

const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function Footer({ onSend, setFooterHeight, footerHeight }: FooterProps) {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const { progress: keyboardProgress, height: keyboardHeight } = useReanimatedKeyboardAnimation()
  const [value, setValue] = useState<string>('')
  const { replyMessage, setReplyMessage } = useChatScreenStore()

  const hasValue: boolean = value.trim() !== ''

  const handleSend = () => {
    if (hasValue) {
      onSend(value.trim(), replyMessage?.id)
      setValue('')
      setReplyMessage(null)
    }
  }

  const animatedViewStyles = useAnimatedStyle((): ViewStyle => {
    return {
      // paddingBottom: withSpring(keyboardProgress.get() > 0.05 ? theme.spacing.lg : insets.bottom, quickSpring),
      // paddingHorizontal: withSpring(keyboardProgress.get() > 0.05  ? theme.spacing.lg : theme.spacing.xxxl, quickSpring),
      paddingBottom: interpolate(keyboardProgress.get(), [0, 1], [insets.bottom, theme.spacing.lg]),
      paddingHorizontal: interpolate(keyboardProgress.get(), [0, 1], [theme.spacing.xxxl, theme.spacing.lg]),
      transform: [{ translateY: keyboardHeight.get() }],
    }
  })

  const onFooterLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (footerHeight === 0 || keyboardProgress.get() === 1) setFooterHeight(event.nativeEvent.layout.height)
    },
    [footerHeight, setFooterHeight, keyboardProgress],
  )

  return (
    <Animated.View onLayout={onFooterLayout} style={[styles.footer, animatedViewStyles]} layout={layoutAnimationSpringy}>
      <GradientBlur />
      {!hasValue && (
        <AnimatedButton blur exiting={zoomAnimationOut} entering={zoomAnimationIn} variant="icon">
          <Icon icon="plus" size={26} color={theme.colors.text} />
        </AnimatedButton>
      )}

      <MessageInput setValue={setValue} hasValue={hasValue} value={value} />

      <Button onPress={handleSend} blur variant="icon">
        {hasValue ? (
          <>
            <Animated.View entering={zoomAnimationIn} style={styles.buttonBackground} />
            <Animated.View key="paperplane" entering={paperplaneAnimationIn} exiting={paperplaneAnimationOut}>
              <Icon icon="paperplane" size={26} color={theme.colors.white} />
            </Animated.View>
          </>
        ) : (
          <Animated.View key="waveform" entering={zoomAnimationIn} exiting={zoomAnimationOut}>
            <Icon icon="waveform" size={26} color={theme.colors.white} />
          </Animated.View>
        )}
      </Button>
    </Animated.View>
  )
}
