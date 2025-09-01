import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    top: 0,
    left: 0,
    right: 0,
    opacity: theme.opacity.secondaryText,
    bottom: 0,
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  view: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
  },
}));