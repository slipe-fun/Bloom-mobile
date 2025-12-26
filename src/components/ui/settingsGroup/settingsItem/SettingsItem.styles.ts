import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
  container: (single: boolean) => ({
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    borderCurve: 'continuous',
    borderRadius: theme.radius.xxs,
    minHeight: single ? 54 : 56,
    backgroundColor: theme.colors.foreground,
  }),
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fontFamily.medium,
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    height: 32,
    minWidth: 32,
    gap: theme.spacing.sm,
  },
  badgeLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
}));