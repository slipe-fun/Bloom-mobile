import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { ROUTES } from "@constants/routes";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { useTokenCheck } from "@hooks";

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
      <RootStack.Navigator
        {...({ id: "appNavigator" } as any)}
        screenOptions={{
          headerShown: false,
          presentation: "card",
          contentStyle: { backgroundColor: "#00000000" },
        }}
      >
        {isAuthenticated ? (
          <RootStack.Screen name={ROUTES.main} component={MainNavigator} />
        ) : (
          <RootStack.Screen name={ROUTES.auth.main} component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
