import { Image, Text, View } from 'react-native'
import { styles } from './Title.styles'

export default function AuthTitle() {
  return (
    <View style={styles.titleContainer}>
      <View style={styles.bloom}>
        <Text style={styles.char}>BL</Text>
        <Image style={{ width: 64, height: 64 }} width={64} height={64} source={require('@assets/auth/eyes.png')} />
        <Text style={styles.char}>M!</Text>
      </View>
      <Text style={styles.description}>🔒 Secured as Bank, ☎️ Simple as SMS and 🏎 Fast as Formula 1</Text>
    </View>
  )
}
