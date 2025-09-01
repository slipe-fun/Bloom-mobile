import { NavigationContainer } from "@react-navigation/native";
import Transition, {
  createNativeStackNavigator,
} from "react-native-screen-transitions";
import MainTabNavigator from "./tabBar/TabBar.navigator";
import { interpolate } from "react-native-reanimated";
import ChatScreen from "@screens/Chat";
import { ROUTES } from "@constants/Routes";
import { slowSpring } from "@constants/Easings";

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: "card",
        }}
      >
        <RootStack.Screen name="MainApp" component={MainTabNavigator} />
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
                  opacity: focused ? interpolate(progress, [0, 1], [0, 1]) : 0,
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
