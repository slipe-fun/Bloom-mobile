import { useSession } from '@providers/SessionProvider'
import { useRouter } from 'expo-router'
import { useLayoutEffect } from 'react'
import { View } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

export default function Index() {
  const { token, loading } = useSession()
  const { theme } = useUnistyles()
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

  return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />
}
