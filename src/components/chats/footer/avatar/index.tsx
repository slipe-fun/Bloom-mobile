import { Avatar } from '@components/ui'
import { springy } from '@constants/animations'
import { ICON_PRESSABLE_SCALE } from '@constants/animations/values'
import { useRouter } from 'expo-router'
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import { styles } from './Avatar.styles'

export default function FooterAvatar() {
  const { push } = useRouter()
  const scale = useSharedValue(1)

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? ICON_PRESSABLE_SCALE : 1, springy))
  }

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return (
    <Transition.Boundary.Trigger
      onTouchStart={() => handlePress(true)}
      onTouchEnd={() => handlePress(false)}
      style={animatedAvatarStyle}
      id="avatar"
      onPress={() => push('/(app)/Settings')}
    >
      <Avatar
        style={styles.avatar}
        image="https://i.pinimg.com/736x/77/5b/a5/775ba539f6a59d678ee01d0353646e88.jpg"
        size="lg"
        userId="dk3k293KK"
      />
    </Transition.Boundary.Trigger>
  )
}
