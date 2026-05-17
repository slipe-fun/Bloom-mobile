import { View, type ViewStyle } from 'react-native'
import { styles } from './Empty.styles'

interface ListCard {
  style: ViewStyle
  data: any
}

export default function ListShuffle() {
  return (
    <View style={styles.shuffleContainer}>
      <ListCard />
      <ListCard />
      <ListCard />
    </View>
  )
}

function ListCard({ style, data }: ListCard) {
  return <View style={styles.shuffleCard}></View>
}
