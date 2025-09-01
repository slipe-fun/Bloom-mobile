import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import WelcomeScreen from "@components/auth/welcomeScreen";
import Button from "@components/auth/welcomeScreen/Button";

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <WelcomeScreen />
      <Button />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
