import { useSession } from '@providers/SessionProvider'
import { useRouter } from 'expo-router'
import { useLayoutEffect } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function Index() {
  const { token, loading } = useSession()
  const { replace } = useRouter()

  useLayoutEffect(() => {
    if (!loading) {
      if (!token) {
        replace('/(auth)/Welcome')
      } else {
        replace('/(app)')
      }
    }
  }, [loading, token])

  return <View style={styles.container} />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}))
