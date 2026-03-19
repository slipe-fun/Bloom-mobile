import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function TabFriends() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>In progress :)</Text>
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
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text,
  },
}))
