import AuthNickInput from '@components/auth/password/NickInput'
import AuthPasswordInput from '@components/auth/password/PasswordInput'
import AuthTitleTemplate from '@components/auth/titleTemplate'
import { ActionText } from '@components/ui'
import { layoutAnimation, quickSpring } from '@constants/animations'
import { useChatKeyboard, useInsets } from '@hooks'
import useAuthStore from '@stores/auth'
import { useEffect } from 'react'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

const AnimatedActionText = Animated.createAnimatedComponent(ActionText)

export default function SignupPassword() {
  const keyboard = useReanimatedKeyboardAnimation()
  const insets = useInsets()
  const { theme } = useUnistyles()
  const error = useAuthStore((state) => state.error)
  const exists = useAuthStore((state) => state.exists)
  const dbUsername = useAuthStore((state) => state.dbUsername)
  // Needs only for read and write first keyboard height to mmkv storage
  const { height: _height } = useChatKeyboard()
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
    <Animated.View style={[styles.container(116 + insets.bottom), animatedStyles]}>
      <AuthTitleTemplate icon="lock" title={exists ? 'Введите пароль' : 'Пароль и ник'} />
      {exists && dbUsername.length > 0 ? null : <AuthNickInput />}
      <AuthPasswordInput />
      <AnimatedActionText
        layout={layoutAnimation}
        style={animatedTextStyles}
        actionText={error || exists ? '' : 'синхронизации ключей'}
        text={
          error
            ? error
            : exists
              ? 'Введите ваш пароль от аккаунта для входа'
              : 'Пароль должен состоять из 8-64 любых символов. Он используется для'
        }
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
