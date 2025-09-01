import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "../constants/Routes";
import { WelcomeScreen, SignUpScreen } from "../screens";

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
        <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
      </Stack.Navigator>
    </>
  );
};

export default AuthNavigator;
