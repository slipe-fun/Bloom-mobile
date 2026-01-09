import { Icon, Input } from '@components/ui'
import { layoutAnimation } from '@constants/animations'
import { useNavigationState } from '@react-navigation/native'
import useAuthStore from '@stores/auth'
import { useEffect, useRef } from 'react'
import type { TextInput } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

const AnimatedInput = Animated.createAnimatedComponent(Input)

export default function AuthNickInput() {
  const { username, setUsername } = useAuthStore()
  const index = useNavigationState((state) => state.index)
  const { theme } = useUnistyles()
  const ref = useRef<TextInput>(null)

  useEffect(() => {
    ref.current?.blur()
  }, [index])

  return (
    <AnimatedInput
      layout={layoutAnimation}
      ref={ref}
      value={username}
      onChangeText={setUsername}
      maxLength={20}
      icon={<Icon size={24} icon="person" color={theme.colors.secondaryText} />}
      placeholder="a-Z . _ - 2-20 длина"
      size="lg"
    />
  )
}
