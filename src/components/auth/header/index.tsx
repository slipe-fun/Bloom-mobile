import { Button, Icon } from '@components/ui'
import { quickSpring } from '@constants/easings'
import { useInsets } from '@hooks'
import { useNavigationState } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Header.styles'

export default function AuthHeader() {
  const index = useNavigationState((state) => state.index)
  const router = useRouter()
  const { theme } = useUnistyles()
  const insets = useInsets()

  const disabled = index === 0 || index === 3

  const back = () => {
    router.canGoBack() && router.back()
  }

  const animatedViewStyle = useAnimatedStyle(() => ({
    opacity: withSpring(disabled ? 0 : 1, quickSpring),
    transform: [{ translateY: withSpring(disabled ? '-50%' : '0%', quickSpring) }],
  }))

  return (
    <Animated.View style={[styles.header(insets.top), animatedViewStyle]}>
      <Button onPress={back} variant="icon" icon={<Icon icon="chevron.left" color={theme.colors.text} size={26} />} />
    </Animated.View>
  )
}
