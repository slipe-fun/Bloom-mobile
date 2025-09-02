import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  footer: {
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.lg,
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  button: (send) => ({
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.full,
    backgroundColor: send ? theme.colors.primary : theme.colors.foreground,
  }),
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    height: 40,
    zIndex: 1,
    color: theme.colors.text,
    borderRadius: theme.radius.full,
    fontSize: theme.fontSize.sm,
		lineHeight: theme.lineHeight.sm,
    fontFamily: theme.fontFamily.medium,
    backgroundColor: theme.colors.foreground,
    borderWidth: 0,
  },
}));
