import AuthFooter from '@components/auth/footer'
import AuthHeader from '@components/auth/header'
import { ROUTES } from '@constants/routes'
import { View } from 'react-native'
import { createBlankStackNavigator } from 'react-native-screen-transitions/blank-stack'
import { SignupEmailScreen, SignupOTP, SignupPassword, WelcomeScreen } from '../screens'
import { screenTransition } from './transition'

const Stack = createBlankStackNavigator()

const AuthNavigator = () => {
  return (
    <>
      <Stack.Navigator
        {...({ id: 'authNavigator' } as any)}
        layout={({ children, state, navigation }) => (
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <AuthHeader navigation={navigation} />
            {children}
            <AuthFooter navigation={navigation} />
          </View>
        )}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#00000000' },
        }}
      >
        <Stack.Screen name={ROUTES.auth.welcome} component={WelcomeScreen} />
        <Stack.Screen name={ROUTES.auth.login} component={WelcomeScreen} options={screenTransition(false)} />
        <Stack.Screen name={ROUTES.auth.signup.email} component={SignupEmailScreen} options={screenTransition(false)} />
        <Stack.Screen name={ROUTES.auth.signup.otp} component={SignupOTP} options={screenTransition(false)} />
        <Stack.Screen name={ROUTES.auth.signup.password} component={SignupPassword} options={screenTransition(false)} />
      </Stack.Navigator>
    </>
  )
}

export default AuthNavigator
