import ChatsProvider from '@api/providers/ChatsContext'
import MessagesProvider from '@api/providers/MessagesContext'
import SeenMessagesProvider from '@api/providers/SeenMessagesContext'
import UserProvider from '@api/providers/UserContext'
import { WebSocketProvider } from '@api/providers/WebSocketContext'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { PortalProvider } from '@gorhom/portal'
import { createSecureStorage } from '@lib/storage'
import LogRocket from '@logrocket/react-native'
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

  const { setMMKV } = useStorageStore()

  useEffect(() => {
    LogRocket.init('cepguw/bloom')
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const storage = await createSecureStorage('user-storage')
        setMMKV(storage)
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
                  <UserProvider>
                    <ChatsProvider>
                      <MessagesProvider>
                        <SeenMessagesProvider>
                          <BottomSheetModalProvider>
                            <Stack id={undefined} screenOptions={{ headerShown: false, contentStyle: styles.content }}>
                              <Stack.Screen name="(app)" options={{ headerShown: false }} />
                              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            </Stack>
                          </BottomSheetModalProvider>
                        </SeenMessagesProvider>
                      </MessagesProvider>
                    </ChatsProvider>
                  </UserProvider>
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
    backgroundColor: theme.colors.black,
  },
}))
