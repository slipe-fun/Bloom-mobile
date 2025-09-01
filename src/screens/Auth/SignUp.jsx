import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Button from "@components/auth/button";

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
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
