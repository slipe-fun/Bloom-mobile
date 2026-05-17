import { getFadeOut, reversedZoomAnimationIn } from '@constants/animations'
import { Text, View } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Empty.styles'
import ListShuffle from './listShuffle'

export default function Empty() {
  const keyboard = useReanimatedKeyboardAnimation()

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] }
  })
  return (
    <Animated.View entering={reversedZoomAnimationIn} exiting={getFadeOut()} style={[styles.container, animatedStyle]}>
      <ListShuffle />
      <View style={styles.textContainer}>
        <Text style={styles.title}>It's quiet here</Text>
        <Text style={styles.subTitle}>Start a conversation with your friends here!</Text>
      </View>
    </Animated.View>
  )
}
