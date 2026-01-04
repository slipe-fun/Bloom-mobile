import AuthActions from '@components/auth/welcome/actions'
import AuthTitle from '@components/auth/welcome/title'
import { useInsets } from '@hooks'
import type React from 'react'
import { View } from 'react-native'
import { styles } from './Welcome.styles'

export default function AuthWelcome(): React.JSX.Element {
  const insets = useInsets()

  return (
    <View style={styles.container(52 + insets.bottom)}>
      <AuthTitle />
      <AuthActions />
    </View>
  )
}
