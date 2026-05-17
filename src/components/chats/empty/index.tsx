import { getFadeOut, reversedZoomAnimationIn } from '@constants/animations'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Empty.styles'
import ListShuffle from './ListShuffle'

export default function Empty() {
  const keyboard = useReanimatedKeyboardAnimation()

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] }
  })
  return (
    <Animated.View entering={reversedZoomAnimationIn} exiting={getFadeOut()} style={[styles.container, animatedStyle]}>
      <ListShuffle />
    </Animated.View>
  )
}
