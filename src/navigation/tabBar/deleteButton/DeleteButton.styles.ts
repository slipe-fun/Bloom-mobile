import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  deleteCharStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteChar: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.white,
    transformOrigin: 'center',
    fontFamily: theme.fontFamily.semibold,
  },
  deleteWrapper: {
    gap: theme.spacing.sm,
    flexDirection: 'row',
    backgroundColor: theme.colors.red,
    borderRadius: theme.radius.full,
    height: 48,
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.xl,
    borderCurve: 'continuous',
    alignItems: 'center',
  }
}));
