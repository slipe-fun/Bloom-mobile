import AuthFooter from '@components/auth/footer'
import AuthHeader from '@components/auth/header'
import { useTokenCheck } from '@hooks'
import { Stack } from '@layouts/Stack'
import { screenTransition } from '@layouts/transition'
import { Redirect } from 'expo-router'
import { View } from 'react-native'

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useTokenCheck()

  if (isLoading) return null

  if (isAuthenticated) return <Redirect href="/(app)/(tabs)/index" />

  return (
    <Stack
      id={undefined}
      layout={({ children }) => (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <AuthHeader />
          {children}
          <AuthFooter />
        </View>
      )}
    >
      <Stack.Screen name="Welcome" />
      <Stack.Screen name="signup/Email" options={screenTransition(false)} />
      <Stack.Screen name="signup/Otp" options={screenTransition(false)} />
      <Stack.Screen name="signup/Password" options={screenTransition(false)} />
    </Stack>
  )
}
