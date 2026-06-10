import Footer from '@components/chat/footer'
import Header from '@components/chat/header'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function Chat() {
  const { chat } = useLocalSearchParams()

  return (
    <View style={styles.container}>
      <Header />
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    flex: 1,
  },
}))
