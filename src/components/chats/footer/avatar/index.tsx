import { Avatar } from '@components/ui'
import { springy } from '@constants/animations'
import { ICON_PRESSABLE_SCALE } from '@constants/animations/values'
import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import { styles } from './Avatar.styles'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function FooterAvatar() {
  const router = useRouter()
  const scale = useSharedValue(1)

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? ICON_PRESSABLE_SCALE : 1, springy))
  }

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))
  // return (
  //   <AnimatedPressable style={animatedAvatarStyle} onTouchStart={() => handlePress(true)} onTouchEnd={() => handlePress(false)}>
  //     <Avatar style={styles.avatar} size="lg" userId="dk3k293KK" />
  //   </AnimatedPressable>
  // )
  return (
    <Transition.Boundary.Trigger id="avatar" onPress={() => router.push('/(app)/Settings')}>
      <Avatar style={styles.avatar} size="lg" userId="dk3k293KK" />
    </Transition.Boundary.Trigger>
  )
}
