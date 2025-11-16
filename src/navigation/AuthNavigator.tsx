import { createNativeStackNavigator } from "react-native-screen-transitions";
import { ROUTES } from "@constants/routes";
import { SignUpEmailScreen, WelcomeScreen } from "../screens";
import { screenTransition } from "./transition";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {

  return (
    <>
      <Stack.Navigator
       {...({ id: "authNavigator"} as any)}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#00000000' }
        }}
        
      >
        <Stack.Screen name={ROUTES.auth.welcome} component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.auth.login} component={WelcomeScreen} options={screenTransition} />
        <Stack.Screen name={ROUTES.auth.signup.email} component={SignUpEmailScreen} options={screenTransition} />
        <Stack.Screen name={ROUTES.auth.signup.otp} component={WelcomeScreen} options={screenTransition} />
        <Stack.Screen name={ROUTES.auth.signup.password} component={WelcomeScreen} options={screenTransition} />
      </Stack.Navigator>
    </>
  );
};

export default AuthNavigator;
