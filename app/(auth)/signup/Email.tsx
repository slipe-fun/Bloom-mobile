import AuthEmailInput from '@components/auth/email/Input'
import AuthTitleTemplate from '@components/auth/titleTemplate'
import { ActionText } from '@components/ui'
import { useInsets } from '@hooks'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

export default function SignupEmail() {
  const keyboard = useReanimatedKeyboardAnimation()
  const insets = useInsets()

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: (keyboard.height.value + insets.top) / 2 }] }
  })

  return (
    <Animated.View style={[styles.container(52 + insets.bottom), animatedStyles]}>
      <AuthTitleTemplate icon="at" title="Введите почту" />
      <AuthEmailInput />
      <ActionText text="После этого мы отправим 6-значный код подтверждения на вашу почту" />
    </Animated.View>
  )
}
const styles = StyleSheet.create((theme) => ({
  container: (paddingBottom: number) => ({
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.lg,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    paddingBottom,
  }),
}))
