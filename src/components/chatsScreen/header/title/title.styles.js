import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  charStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  char: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.bold,
  }
}));
