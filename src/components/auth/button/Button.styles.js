import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  button: {
    height: 44,
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.semibold,
    lineHeight: theme.lineHeight.md,
    color: theme.colors.white,
  },
}));
