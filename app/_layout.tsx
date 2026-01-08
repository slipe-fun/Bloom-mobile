import ChatsProvider from '@api/providers/ChatsContext'
import MessagesProvider from '@api/providers/MessagesContext'
import SeenMessagesProvider from '@api/providers/SeenMessagesContext'
import { WebSocketProvider } from '@api/providers/WebSocketContext'
import { PortalProvider } from '@gorhom/portal'
import initRealm from '@lib/initRealm'
import { createSecureStorage } from '@lib/storage'
import { SessionProvider } from '@providers/SessionProvider'
import useStorageStore from '@stores/storage'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StyleSheet, UnistylesRuntime, useUnistyles } from 'react-native-unistyles'

export default function RootLayout() {
  const { theme } = useUnistyles()
  const [fontsLoaded, fontError] = useFonts({
    'OpenRunde-Regular': require('@assets/fonts/OpenRunde-Regular.ttf'),
    'OpenRunde-Medium': require('@assets/fonts/OpenRunde-Medium.ttf'),
    'OpenRunde-Semibold': require('@assets/fonts/OpenRunde-Semibold.ttf'),
    'OpenRunde-Bold': require('@assets/fonts/OpenRunde-Bold.ttf'),
  })

  const { setMMKV, setRealm } = useStorageStore()

  useEffect(() => {
    ;(async () => {
      try {
        const storage = await createSecureStorage('user-storage')
        const realm = await initRealm()
        setMMKV(storage)
        setRealm(realm)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  useEffect(() => {
    UnistylesRuntime.setRootViewBackgroundColor(theme.colors.background)
  }, [theme])

  return (
    fontsLoaded &&
    !fontError && (
      <SafeAreaProvider>
        <KeyboardProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PortalProvider>
              <StatusBar style="auto" />
              <SessionProvider>
                <WebSocketProvider>
                  <ChatsProvider>
                    <MessagesProvider>
                      <SeenMessagesProvider>
                        <Stack id={undefined} screenOptions={{ headerShown: false, contentStyle: styles.content }}>
                          <Stack.Screen name="(app)" options={{ headerShown: false }} />
                          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        </Stack>
                      </SeenMessagesProvider>
                    </MessagesProvider>
                  </ChatsProvider>
                </WebSocketProvider>
              </SessionProvider>
            </PortalProvider>
          </GestureHandlerRootView>
        </KeyboardProvider>
      </SafeAreaProvider>
    )
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    backgroundColor: theme.colors.background,
  },
}))
