import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  inputWrapper: {
    height: 40,
    flexDirection: "row",
    width: "100%",
    overflow: "hidden",
    gap: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.foreground,
  },
  input: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.lineHeight.sm,
    paddingVertical: theme.spacing.sm,
    height: 40,
    textAlignVertical: "center",
    color: theme.colors.text,
    fontFamily: theme.fontFamily.medium,
  },
}));
