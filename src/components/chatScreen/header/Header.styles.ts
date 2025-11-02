import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  header: {
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    flexDirection: "row",
    zIndex: 1,
    top: 0,
    position: "absolute",
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.semibold,
  },
  time: {
    width: "100%",
    textAlign: "center",
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  button: {
    backgroundColor: theme.colors.foregroundBlur,
  },
}));
