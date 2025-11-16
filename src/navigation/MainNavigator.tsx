import { createNativeStackNavigator } from "react-native-screen-transitions";
import MainTabNavigator from "./tabBar";
import { ChatScreen } from "@screens";
import { ROUTES } from "@constants/routes";
import { screenTransition } from "./transition";

const Stack = createNativeStackNavigator();

export default function MainNavigator(): React.JSX.Element {

  return (
    <Stack.Navigator {...({ id: "mainNavigator"} as any)} screenOptions={{ headerShown: false, contentStyle: {backgroundColor: "#00000000"} }}>
      <Stack.Screen name={ROUTES.tabs.navigator} component={MainTabNavigator} />
      <Stack.Screen name={ROUTES.chat} component={ChatScreen} options={screenTransition} />
    </Stack.Navigator>
  );
}
