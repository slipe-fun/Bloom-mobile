import { Icon, Input } from '@components/ui'
import { layoutAnimation, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { useNavigationState } from '@react-navigation/native'
import useAuthStore from '@stores/auth'
import { useEffect, useRef, useState } from 'react'
import { Pressable, type TextInput } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Input.styles'

const AnimatedInput = Animated.createAnimatedComponent(Input)

export default function AuthPasswordInput() {
  const { password, setPasssword } = useAuthStore()
  const index = useNavigationState((state) => state.index)
  const [secure, setSecure] = useState<boolean>(true)
  const { theme } = useUnistyles()
  const ref = useRef<TextInput>(null)

  useEffect(() => {
    ref.current?.blur()
  }, [index])

  return (
    <AnimatedInput
      ref={ref}
      layout={layoutAnimation}
      value={password}
      onChangeText={setPasssword}
      maxLength={64}
      secureTextEntry={secure}
      keyboardType="default"
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      autoComplete="password"
      icon={<Icon size={26} icon="lock" color={theme.colors.secondaryText} />}
      placeholder="Пароль здесь"
      size="lg"
      button={
        <Pressable style={styles.secureButton} onPress={() => setSecure((prev) => !prev)}>
          {secure ? (
            <Animated.View key={45} entering={zoomAnimationIn} exiting={zoomAnimationOut}>
              <Icon color={theme.colors.secondaryText} icon="eye" />
            </Animated.View>
          ) : (
            <Animated.View key={46} entering={zoomAnimationIn} exiting={zoomAnimationOut}>
              <Icon color={theme.colors.secondaryText} icon="eye.slashed" />
            </Animated.View>
          )}
        </Pressable>
      }
    />
  )
}
