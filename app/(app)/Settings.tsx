import { Avatar } from '@components/ui'
import { Text, View } from 'react-native'
import Transition from 'react-native-screen-transitions'
import { StyleSheet } from 'react-native-unistyles'

export default function Settings() {
  return (
    <View style={styles.container}>
      <Avatar style={styles.avatar} size="xl" userId="dk3k293KK" />
      <Text style={styles.title}>Settings</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
    flex: 1,
    fontFamily: theme.fontFamily.semibold,
    color: theme.colors.text,
  },
  avatar: {
    boxShadow: `${theme.shadows.pressable} ${theme.colors.shadow}`,
  },
}))
