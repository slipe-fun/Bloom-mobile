import AuthNickInput from '@components/auth/password/NickInput'
import AuthPasswordInput from '@components/auth/password/PasswordInput'
import AuthTitleTemplate from '@components/auth/titleTemplate'
import { ActionText } from '@components/ui'
import { useInsets } from '@hooks'
import type React from 'react'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Password.styles'

export default function SignupPassword(): React.JSX.Element {
  const keyboard = useReanimatedKeyboardAnimation()
  const insets = useInsets()

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: (keyboard.height.value + insets.top) / 2 }] }
  })

  return (
    <Animated.View style={[styles.container(116 + insets.bottom), animatedStyles]}>
      <AuthTitleTemplate icon="lock" title="Пароль и ник" />
      <AuthNickInput />
      <AuthPasswordInput />
      <ActionText actionText="синхранизации ключей" children="Пароль должен состоять из 8-64 любых символов. Он используется для" />
    </Animated.View>
  )
}
