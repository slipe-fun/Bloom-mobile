import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  chat: {
    flexDirection: "row",
    paddingRight: theme.spacing.lg,
    alignItems: "center",
    paddingLeft: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  avatarWrapper: {
    padding: theme.spacing.lg,
    paddingLeft: 0,
    paddingRight: theme.spacing.xs,
  },
  charStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs + 2,
    paddingVertical: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  name: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fontFamily.semibold,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  secondary: (edit: boolean) => ({
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
    marginRight: edit ? 100 : 0,
  }),
  separator: {
    left: 0,
    right: 0,
    marginLeft: 52 + theme.spacing.lg * 2,
    height: 1,
    bottom: 0,
    marginRight: theme.spacing.lg,
    position: "absolute",
    backgroundColor: theme.colors.foreground,
  },
  pinButton: (pinned: boolean) => ({
    backgroundColor: pinned ? theme.colors.redBackdrop : theme.colors.yellowBackdrop,
  }),
  pinButtonWrapper: {
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
}));
