import { Avatar } from '@components/ui'
import { Text, View } from 'react-native'
import Transition from 'react-native-screen-transitions'
import { StyleSheet } from 'react-native-unistyles'

export default function Settings() {
  return (
    <View style={styles.container}>
      <Transition.Boundary.View style={{ width: 100, height: 100 }} id="avatar">
        <Avatar style={styles.avatar} size="2xl" userId="dk3k293KK" />
      </Transition.Boundary.View>
      <Text style={styles.title}>Settings</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    boxShadow: `${theme.shadows.pressable} ${theme.colors.shadow}`,
    paddingTop: 80,
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
