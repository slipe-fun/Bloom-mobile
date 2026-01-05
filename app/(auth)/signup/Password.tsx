import AuthNickInput from '@components/auth/password/NickInput'
import AuthPasswordInput from '@components/auth/password/PasswordInput'
import AuthTitleTemplate from '@components/auth/titleTemplate'
import { ActionText } from '@components/ui'
import { useInsets } from '@hooks'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

export default function SignupPassword() {
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
      <ActionText actionText="синхранизации ключей" text="Пароль должен состоять из 8-64 любых символов. Он используется для" />
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
