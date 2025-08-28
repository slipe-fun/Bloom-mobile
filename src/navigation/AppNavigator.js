import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./tabBar/TabBar.navigator";

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {

  return (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "simple_push",
            presentation: "card",
          }}
        >
              <RootStack.Screen name="MainApp" component={MainTabNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
  );
};
