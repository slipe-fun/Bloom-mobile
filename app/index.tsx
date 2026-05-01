import { useSession } from '@providers/SessionProvider'
import { Redirect } from 'expo-router'

export default function Index() {
  const { token } = useSession()

  if (!token) {
    return <Redirect href="/(auth)/Welcome" />
  }

  return <Redirect href="/(app)" />
}
