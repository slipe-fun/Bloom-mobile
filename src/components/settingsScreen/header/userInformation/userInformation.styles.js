import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  subText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    opacity: theme.opacity.contentText,
  },
  separator: {
    width: 5,
    height: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.white,
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fontFamily.semibold,
  },
}));