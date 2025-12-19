import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  deleteBackground: {
    top: 0,
    bottom: 0,
    position: "absolute",
    width: 100,
    backgroundColor: theme.colors.red,
    borderRadius: theme.radius.full,
  },
  deleteCharStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteChar: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.white,
    transformOrigin: 'center',
    fontFamily: theme.fontFamily.semibold,
  },
  deleteWrapper: {
    gap: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  }
}));
