import { authAnimationIn, springyChar } from '@constants/animations'
import { Image, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { styles } from './Title.styles'

export default function AuthTitle() {
  return (
    <View style={styles.titleContainer}>
      <Animated.View entering={authAnimationIn(springyChar(1, true))} style={styles.bloom}>
        <Text style={styles.char}>BL</Text>
        <Image style={{ width: 64, height: 64 }} width={64} height={64} source={require('@assets/auth/eyes.png')} />
        <Text style={styles.char}>M!</Text>
      </Animated.View>
      <Animated.Text entering={authAnimationIn(springyChar(2, true))} style={styles.description}>
        🔒 Secured as Bank, ☎️ Simple as SMS and 🏎 Fast as Formula 1
      </Animated.Text>
    </View>
  )
}
