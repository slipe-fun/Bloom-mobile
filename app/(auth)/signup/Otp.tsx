import AuthTitleTemplate from '@components/auth/titleTemplate'
import { ActionText, OTPInput } from '@components/ui'
import { useInsets } from '@hooks'
import useAuthStore from '@stores/auth'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

export default function SignupOTP() {
  const { email, otp, setOtp } = useAuthStore()
  const keyboard = useReanimatedKeyboardAnimation()
  const insets = useInsets()

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: (keyboard.height.value + insets.top) / 2 }] }
  })

  return (
    <Animated.View style={[styles.container(52 + insets.bottom), animatedStyles]}>
      <AuthTitleTemplate icon="id" title="Проверка почты" />
      <OTPInput value={otp} onChange={setOtp} />
      <ActionText text="Введите 6-значный код, который был отправлен на" actionText={email} />
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
