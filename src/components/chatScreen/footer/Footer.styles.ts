import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
  footer: {
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    flexDirection: "row",
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 0,
    gap: theme.spacing.md,
  },
  inputWrapper: {
    backgroundColor: theme.colors.foregroundBlur,
    borderRadius: 22,
    overflow: 'hidden',
    flex: 1,
    borderCurve: "continuous",
    zIndex: 1,
  },
  blur: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
}));
