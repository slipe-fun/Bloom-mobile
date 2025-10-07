import "unistyles.js";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { enableScreens } from "react-native-screens";
import AppNavigator from "src/navigation/AppNavigator";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { WebSocketProvider } from "@providers/WebSocketContext";
import ChatsProvider from "@providers/ChatsContext";
import MessagesProvider from "@providers/MessagesContext";

enableScreens();

const fontsToLoad = {
  "OpenRunde-Regular": require("./assets/fonts/OpenRunde-Regular.ttf"),
  "OpenRunde-Medium": require("./assets/fonts/OpenRunde-Medium.ttf"),
  "OpenRunde-Semibold": require("./assets/fonts/OpenRunde-Semibold.ttf"),
  "OpenRunde-Bold": require("./assets/fonts/OpenRunde-Bold.ttf"),
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontsToLoad);

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <WebSocketProvider>
            <ChatsProvider>
              <MessagesProvider>
                <AppNavigator />
              </MessagesProvider>
            </ChatsProvider>
          </WebSocketProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
