import { useSession } from '@providers/SessionProvider'
import { useRouter } from 'expo-router'
import { useLayoutEffect } from 'react'
import { View } from 'react-native'

export default function Index() {
  const { token, loading } = useSession()
  const router = useRouter()

  useLayoutEffect(() => {
    if (!loading) {
      if (!token) {
        router.replace('/(auth)/Welcome')
      } else {
        router.replace('/(app)')
      }
    }
  }, [loading, token])

  return <View style={{ flex: 1, backgroundColor: 'white' }} />
}
