import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
  container: {
    marginBottom: theme.spacing.xxl,
    borderRadius: theme.radius.xl,
    gap: theme.spacing.sm,
    borderCurve: 'continuous',
    overflow: "hidden",
  }
}));