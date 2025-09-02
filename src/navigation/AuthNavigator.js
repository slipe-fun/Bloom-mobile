import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../constants/Routes";
import { WelcomeScreen, RegisterScreen, LoginScreen } from "../screens";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "simple_push",
          presentation: "card"
        }}
      >
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      </Stack.Navigator>
    </>
  );
};

export default AuthNavigator;
