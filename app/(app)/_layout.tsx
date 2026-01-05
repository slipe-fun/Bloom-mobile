import { useTokenCheck } from '@hooks'
import { Stack } from '@layouts/Stack'
import { screenTransition } from '@layouts/transition'
import { Redirect } from 'expo-router'

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useTokenCheck()
  if (isLoading) return null

  if (!isAuthenticated) return <Redirect href="/(auth)/Welcome" />

  return (
    <Stack id={undefined}>
      <Stack.Screen name="(tabs)" options={screenTransition()} />
      <Stack.Screen name="chat" options={screenTransition()} />
    </Stack>
  )
}
