import { createNativeStackNavigator } from "react-native-screen-transitions";
import MainTabNavigator from "./tabBar/TabBar.navigator";
import { ChatScreen } from "@screens";
import { ROUTES } from "@constants/Routes";
import { useInsets } from "@hooks";
import { chatTransition } from "./transition";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const insets = useInsets();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: {backgroundColor: "#00000000"} }}>
      <Stack.Screen name={ROUTES.TAB_NAVIGATOR} component={MainTabNavigator} />
      <Stack.Screen name={ROUTES.CHAT} component={ChatScreen} options={chatTransition(insets)} />
    </Stack.Navigator>
  );
}
