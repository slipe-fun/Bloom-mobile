import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
  chat: {
    flexDirection: "row",
    paddingRight: theme.spacing.lg,
  },
  avatarWrapper: {
    padding: theme.spacing.lg,
  },
  charStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
    borderBottomColor: theme.colors.foreground,
    borderBottomWidth: 1,
    paddingVertical: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  name: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.fontFamily.semibold,
  },
  nameWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  secondary: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
  unreadMark: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
}));