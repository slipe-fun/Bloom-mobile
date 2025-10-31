import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
  footer: {
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    flexDirection: "row",
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 0,
    gap: theme.spacing.lg,
  },
  input: {
    flex: 1,
    paddingLeft: theme.spacing.lg,
    paddingVertical: 10,
    height: 'auto',
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    borderWidth: 0,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    alignItems: 'flex-end',
    flexDirection: 'row',
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
  button: (input: boolean) => ({
    backgroundColor: input ? "transparent" : 'rgba(255, 255, 255, 0.07)'
  })
}));
