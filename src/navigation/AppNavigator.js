import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-native-screen-transitions";
import MainTabNavigator from "./tabBar/TabBar.navigator";
import { interpolate } from "react-native-reanimated";
import { ChatScreen } from "@screens";
import { ROUTES } from "@constants/Routes";
import { slowSpring } from "@constants/Easings";
import { useState, useEffect } from "react";
import { createSecureStorage } from "@lib/Storage";
import * as SplashScreen from "expo-splash-screen";
import AuthNavigator from "./AuthNavigator";

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavReady, setIsNavReady] = useState(false);

  useEffect(() => {
    let listener;
    let storageInstance;

    const init = async () => {
      try {
        storageInstance = await createSecureStorage("user-storage");
        const token = storageInstance.getString("token");

        setIsAuthenticated(!!token);

        listener = storageInstance.addOnValueChangedListener((changedKey) => {
          if (changedKey === "token") {
            const nextToken = storageInstance.getString("token");
            setIsAuthenticated(!!nextToken);
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    init();

    return () => {
      try {
        listener?.remove();
      } catch { }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && isNavReady) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [isLoading, isNavReady]);

  if (isLoading) return null;

  return (
    <NavigationContainer onReady={() => setIsNavReady(true)}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: "card",
        }}
      >
        {isAuthenticated ? (
          <>
            <RootStack.Screen name={ROUTES.MAIN} component={MainTabNavigator} />
            <RootStack.Screen
              options={{
                enableTransitions: true,
                gestureEnabled: true,
                gestureDirection: ["horizontal"],
                screenStyleInterpolator: ({
                  current,
                  layouts: { screen },
                  progress,
                  focused,
                }) => {
                  "worklet";
                  const scale = interpolate(progress, [0, 1, 2], [0, 1, 0.75]);
                  const borderRadius = interpolate(
                    progress,
                    [0, 1, 2],
                    [36, 36, 36]
                  );
                  const translateY = interpolate(
                    current.gesture.normalizedY,
                    [-1, 1],
                    [-screen.height * 0.5, screen.height * 0.5],
                    "clamp"
                  );
                  const translateX = interpolate(
                    current.gesture.normalizedX,
                    [-1, 1],
                    [-screen.width * 0.5, screen.width * 0.5],
                    "clamp"
                  );

                  return {
                    overlayStyle: {
                      backgroundColor: "rgba(0,0,0,0.85)",
                      opacity: focused
                        ? interpolate(progress, [0, 1], [0, 1])
                        : 0,
                    },
                    contentStyle: {
                      transform: [
                        { scale },
                        { translateY: translateY },
                        { translateX },
                      ],
                      borderRadius,
                      overflow: "hidden",
                    },
                  };
                },
                transitionSpec: {
                  open: slowSpring,
                  close: slowSpring,
                },
              }}
              name={ROUTES.CHAT}
              component={ChatScreen}
            />
          </>
        ) : (
          <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
