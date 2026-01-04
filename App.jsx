import 'unistyles.ts'
import ChatsProvider from '@api/providers/ChatsContext'
import MessagesProvider from '@api/providers/MessagesContext'
import SeenMessagesProvider from '@api/providers/SeenMessagesContext'
import { WebSocketProvider } from '@api/providers/WebSocketContext'
import { PortalProvider } from '@gorhom/portal'
import initRealm from '@lib/initRealm'
import { createSecureStorage } from '@lib/storage'
import useStorageStore from '@stores/storage'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import AppNavigator from 'src/navigation/AppNavigator'

enableScreens()

const fontsToLoad = {
  'OpenRunde-Regular': require('@assets/fonts/OpenRunde-Regular.ttf'),
  'OpenRunde-Medium': require('@assets/fonts/OpenRunde-Medium.ttf'),
  'OpenRunde-Semibold': require('@assets/fonts/OpenRunde-Semibold.ttf'),
  'OpenRunde-Bold': require('@assets/fonts/OpenRunde-Bold.ttf'),
}

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontsToLoad)

  const { setMMKV, setRealm } = useStorageStore()

  useEffect(() => {
    ;(async () => {
      const storage = await createSecureStorage('user-storage')
      const realm = await initRealm()

      setMMKV(storage)
      setRealm(realm)
    })()
  }, [])

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PortalProvider>
            <StatusBar style="light" />
            <WebSocketProvider>
              <ChatsProvider>
                <MessagesProvider>
                  <SeenMessagesProvider>
                    <AppNavigator />
                  </SeenMessagesProvider>
                </MessagesProvider>
              </ChatsProvider>
            </WebSocketProvider>
          </PortalProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}
