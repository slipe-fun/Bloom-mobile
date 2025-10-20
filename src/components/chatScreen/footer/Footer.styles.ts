import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
  footer: {
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.lg,
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    height: 40,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    borderWidth: 0,
  },
  inputWrapper: {
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    flexDirection: 'row',
    flex: 1,
    borderCurve: "continuous",
    zIndex: 1,
  },
}));
