import AuthActions from '@components/auth/welcome/actions'
import AuthTitle from '@components/auth/welcome/title'
import { useInsets } from '@hooks'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function Welcome() {
  const insets = useInsets()

  return (
    <View style={styles.container(52 + insets.bottom)}>
      <AuthTitle />
      <AuthActions />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: (paddingBottom: number) => ({
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom,
    backgroundColor: theme.colors.background,
  }),
}))
