import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function TabExplore() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello :)</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
  },
}))
