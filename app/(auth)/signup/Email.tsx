import AuthEmailInput from '@components/auth/email/Input'
import AuthTitleTemplate from '@components/auth/titleTemplate'
import { ActionText } from '@components/ui'
import { layoutAnimation, quickSpring } from '@constants/animations'
import { useInsets } from '@hooks'
import useAuthStore from '@stores/auth'
import { useEffect } from 'react'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

const AnimatedActionText = Animated.createAnimatedComponent(ActionText)

export default function SignupEmail() {
  const keyboard = useReanimatedKeyboardAnimation()
  const insets = useInsets()
  const { theme } = useUnistyles()
  const error = useAuthStore((state) => state.error)
  const errorValue = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: (keyboard.height.value + insets.top) / 2 }] }
  })

  const animatedTextStyles = useAnimatedStyle(
    () => ({
      color: interpolateColor(errorValue.get(), [0, 1], [theme.colors.secondaryText, theme.colors.red]),
    }),
    [theme, error],
  )

  useEffect(() => {
    errorValue.set(withSpring(error ? 1 : 0, quickSpring))
  }, [error])

  return (
    <Animated.View style={[styles.container(52 + insets.bottom), animatedStyles]}>
      <AuthTitleTemplate icon="at" title="Введите почту" />
      <AuthEmailInput />
      <AnimatedActionText
        layout={layoutAnimation}
        style={animatedTextStyles}
        text={error ? error : 'После этого мы отправим 6-значный код подтверждения на вашу почту'}
      />
    </Animated.View>
  )
}
const styles = StyleSheet.create((theme) => ({
  container: (paddingBottom: number) => ({
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.lg,
    justifyContent: 'center',
    paddingBottom,
  }),
}))
