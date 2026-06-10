import { settingsDemo } from '@constants/emptyStates'
import { Image, View } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Demonstration.styles'

const patterns = [require('@assets/settings/patternDark.webp'), require('@assets/settings/patternLight.webp')]

export default function Demonstration() {
  const { rt } = useUnistyles()

  return (
    <>
      <View style={styles.container}>
        <Image resizeMode="cover" style={styles.pattern} source={rt.themeName.includes('dark') ? patterns[0] : patterns[1]} />
        {settingsDemo.map((item) => (
          <View key={item.messageWidth} style={styles.message(item.me)}>
            {item?.avatar && !item.me && <Image source={item.avatar} style={styles.avatar} />}
            <View style={styles.messageBubble(item.me)}>
              <View style={[styles.messagePlaceholder(item.me), { width: item.messageWidth * 10 }]} />
            </View>
            {item?.avatar && item.me && <Image source={item.avatar} style={styles.avatar} />}
          </View>
        ))}
      </View>
      <View style={styles.borderOverlay} />
    </>
  )
}
