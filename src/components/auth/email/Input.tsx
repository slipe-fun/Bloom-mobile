import { Icon, Input } from '@components/ui'
import { layoutAnimation, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { PROVIDERS_LOGOS } from '@constants/providersLogos'
import parseEmail from '@lib/parseEmail'
import { useNavigationState } from '@react-navigation/native'
import useAuthStore from '@stores/auth'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { TextInput } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Input.styles'

const AnimatedInput = Animated.createAnimatedComponent(Input)

export default function AuthEmailInput() {
  const email = useAuthStore((state) => state.email)
  const setEmail = useAuthStore((state) => state.setEmail)
  const setEmailValid = useAuthStore((state) => state.setEmailValid)
  const { theme } = useUnistyles()
  const index = useNavigationState((state) => state.index)
  const ref = useRef<TextInput>(null)
  const [provider, setProvider] = useState<keyof typeof PROVIDERS_LOGOS | 'unknown'>('unknown')

  const icon = useMemo(() => {
    if (provider === 'unknown') {
      return (
        <Animated.View entering={zoomAnimationIn} exiting={zoomAnimationOut}>
          <Icon size={26} icon="at" key="icon-at" color={theme.colors.secondaryText} />
        </Animated.View>
      )
    } else {
      if (provider in PROVIDERS_LOGOS) {
        return (
          <Animated.Image
            source={PROVIDERS_LOGOS[provider]}
            style={styles.logoIcon}
            key="image-provider"
            entering={zoomAnimationIn}
            exiting={zoomAnimationOut}
          />
        )
      }
    }
  }, [provider])

  useEffect(() => {
    const { valid, provider } = parseEmail(email)
    setEmailValid(valid)
    setProvider(provider)
  }, [email, setEmailValid])

  useEffect(() => {
    ref.current?.blur()
  }, [index])

  return (
    <AnimatedInput
      layout={layoutAnimation}
      ref={ref}
      value={email}
      onChangeText={setEmail}
      maxLength={64}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="done"
      textContentType="emailAddress"
      autoComplete="email"
      icon={icon}
      placeholder="example@gmail.com"
      size="lg"
    />
  )
}
