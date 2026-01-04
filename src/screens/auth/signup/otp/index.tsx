import AuthTitleTemplate from '@components/auth/titleTemplate'
import { ActionText, OTPInput } from '@components/ui'
import { useInsets } from '@hooks'
import useAuthStore from '@stores/auth'
import type React from 'react'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Otp.styles'

export default function SignupOTP(): React.JSX.Element {
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
      <ActionText children="Введите 6-значный код, который был отправлен на" actionText={email} />
    </Animated.View>
  )
}
