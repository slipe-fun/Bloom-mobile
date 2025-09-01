import { StyleSheet } from "react-native-unistyles"; 

export const styles = StyleSheet.create((theme) => ({
  page: {
    flex: 1,
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xxl,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: theme.fontSize.xl,
    lineHeight: theme.lineHeight.xl,
    textAlign: "center",
    fontFamily: theme.fontFamily.semibold,
  },
  description: {
    fontSize: theme.fontSize.md,
    lineHeight: theme.lineHeight.md,
    textAlign: "center",
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
}));
