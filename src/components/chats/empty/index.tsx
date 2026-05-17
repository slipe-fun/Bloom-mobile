import { View } from 'react-native'
import { styles } from './Empty.styles'
import ListShuffle from './ListShuffle'

export default function Empty() {
  return (
    <View style={styles.container}>
      <ListShuffle />
    </View>
  )
}
