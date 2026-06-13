import ChatsProvider from '@api/providers/ChatsContext'
import MessagesProvider from '@api/providers/MessagesContext'
import SeenMessagesProvider from '@api/providers/SeenMessagesContext'
import UserProvider from '@api/providers/UserContext'
import { WebSocketProvider } from '@api/providers/WebSocketContext'
import { clientPersister, queryClient } from '@api/queryClient'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import LogRocket from '@logrocket/react-native'
import { SessionProvider } from '@providers/SessionProvider'
import useStorageStore from '@stores/storage'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { useEffect, useLayoutEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StyleSheet, UnistylesRuntime, useUnistyles } from 'react-native-unistyles'
import { database } from 'src/db'

function ThemeManager() {
  const { theme } = useUnistyles()

  useLayoutEffect(() => {
    UnistylesRuntime.setRootViewBackgroundColor(theme.colors.background)
    // @ts-expect-error
    UnistylesRuntime.statusBar.setStyle(theme.statusbar.style, true)
  }, [theme])

  return null
}

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
      const { default: getSKID } = await import('@lib/skid-v3')
      const skid = getSKID()
      try {
        skid.keys.identity.generate()
      } catch {}
    })()
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
        <ThemeManager />
        <KeyboardProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: clientPersister }}>
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
            </PersistQueryClientProvider>
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
