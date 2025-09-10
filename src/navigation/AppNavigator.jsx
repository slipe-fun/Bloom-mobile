import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-native-screen-transitions";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { ROUTES } from "@constants/Routes";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import useTokenCheck from "@hooks/useTokenCheck";

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useTokenCheck();
  const [isNavReady, setIsNavReady] = useState(false);

  useEffect(() => {
    if (!isLoading && isNavReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading, isNavReady]);

  if (isLoading) return null;

  return (
    <NavigationContainer onReady={() => setIsNavReady(true)}>
      <RootStack.Navigator screenOptions={{ headerShown: false, presentation: "card" }}>
        {isAuthenticated ? (
          <RootStack.Screen name={ROUTES.MAIN} component={MainNavigator} />
        ) : (
          <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
