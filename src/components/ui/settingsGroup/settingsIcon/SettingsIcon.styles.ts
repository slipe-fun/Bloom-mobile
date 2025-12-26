import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
  container: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.full,
  },
}));