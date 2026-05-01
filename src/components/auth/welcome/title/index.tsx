import { authAnimationIn, springyChar } from '@constants/animations'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { styles } from './Title.styles'

export default function AuthTitle() {
  const { t } = useTranslation('auth')

  return (
    <View style={styles.titleContainer}>
      <Animated.View entering={authAnimationIn(springyChar(1, true))} style={styles.bloom}>
        <Text style={styles.char}>BL</Text>
        <Image style={{ width: 64, height: 64 }} width={64} height={64} source={require('@assets/auth/eyes.png')} />
        <Text style={styles.char}>M!</Text>
      </Animated.View>
      <Animated.Text entering={authAnimationIn(springyChar(2, true))} style={styles.description}>
        {t('auth:welcome.subtitle')}
      </Animated.Text>
    </View>
  )
}
