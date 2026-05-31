import ChatsProvider from '@api/providers/ChatsContext'
import MessagesProvider from '@api/providers/MessagesContext'
import SeenMessagesProvider from '@api/providers/SeenMessagesContext'
import UserProvider from '@api/providers/UserContext'
import { WebSocketProvider } from '@api/providers/WebSocketContext'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import LogRocket from '@logrocket/react-native'
import { SessionProvider } from '@providers/SessionProvider'
import useStorageStore from '@stores/storage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
    },
  },
})

export default function RootLayout() {
  const { ensureMMKV } = useStorageStore()
  const [fontsLoaded, fontError] = useFonts({
    'OpenRunde-Regular': require('@assets/fonts/OpenRunde-Regular.ttf'),
    'OpenRunde-Medium': require('@assets/fonts/OpenRunde-Medium.ttf'),
    'OpenRunde-Semibold': require('@assets/fonts/OpenRunde-Semibold.ttf'),
    'OpenRunde-Bold': require('@assets/fonts/OpenRunde-Bold.ttf'),
  })

  useEffect(() => {
    LogRocket.init('cepguw/bloom', { textSanitizer: 'excluded' })
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        await ensureMMKV()
      } catch (error) {
        console.error(error)
      }
    })()
  }, [ensureMMKV])

  return (
    fontsLoaded &&
    !fontError && (
      <SafeAreaProvider>
        <KeyboardProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <QueryClientProvider client={queryClient}>
              <SessionProvider>
                <WebSocketProvider>
                  <UserProvider>
                    <ChatsProvider>
                      <MessagesProvider>
                        <SeenMessagesProvider>
                          <BottomSheetModalProvider>
                            <Stack id={undefined} screenOptions={{ headerShown: false, contentStyle: styles.content, animation: 'fade' }}>
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
            </QueryClientProvider>
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
