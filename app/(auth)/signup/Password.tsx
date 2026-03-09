import AuthNickInput from '@components/auth/password/NickInput'
import AuthPasswordInput from '@components/auth/password/PasswordInput'
import AuthTitleTemplate from '@components/auth/titleTemplate'
import { ActionText } from '@components/ui'
import { layoutAnimation, quickSpring } from '@constants/animations'
import { useChatKeyboard, useInsets } from '@hooks'
import useAuthStore from '@stores/auth'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'

const AnimatedActionText = Animated.createAnimatedComponent(ActionText)

export default function SignupPassword() {
  const keyboard = useReanimatedKeyboardAnimation()
  const insets = useInsets()
  const theme = useAnimatedTheme()
  const error = useAuthStore((state) => state.error)
  const exists = useAuthStore((state) => state.exists)
  const dbUsername = useAuthStore((state) => state.dbUsername)
  // Needs only for read and write first keyboard height to mmkv storage
  const { height: _height } = useChatKeyboard()
  const errorValue = useSharedValue(0)
  const { t } = useTranslation()

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: (keyboard.height.value + insets.top) / 2 }] }
  })

  const animatedTextStyles = useAnimatedStyle(
    () => ({
      color: interpolateColor(errorValue.get(), [0, 1], [theme.value.colors.secondaryText, theme.value.colors.red]),
    }),
    [error],
  )

  useEffect(() => {
    errorValue.set(withSpring(error ? 1 : 0, quickSpring))
  }, [error])

  return (
    <Animated.View style={[styles.container(116 + insets.bottom), animatedStyles]}>
      <AuthTitleTemplate icon="lock" title={t(exists ? 'auth:password.existsTitle' : 'auth:password.title')} />
      {exists && dbUsername.length > 0 ? null : <AuthNickInput />}
      <AuthPasswordInput />
      <AnimatedActionText
        layout={layoutAnimation}
        style={animatedTextStyles}
        actionText={error || exists ? '' : t('auth:password.actionText')}
        text={error ? error : t(exists ? 'auth:password.existsSubTitle' : 'auth:password.subTitle')}
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
