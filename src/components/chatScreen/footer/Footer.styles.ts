import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  footer: {
    width: '100%',
    paddingTop: theme.spacing.md,
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 0,
    gap: theme.spacing.md,
  },
  messageInputWrapper: {
    width: '100%',
    flex: 1,
    minHeight: 44,
    backgroundColor: theme.colors.pressable,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    boxShadow: `${theme.shadows.pressable} ${theme.colors.shadow}`,
    flexDirection: 'column',
    borderColor: theme.colors.border,
    borderWidth: theme.borderWidth.md,
  },
  replyBlockWrapper: {
    width: '100%',
    padding: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  replyBlock: {
    height: 36,
    borderRadius: theme.radius.full,
    borderCurve: 'continuous',
    backgroundColor: theme.colors.foregroundTransparent,
    paddingLeft: theme.spacing.md,
    paddingVertical: 0,
    gap: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.sm,
    flex: 1,
    color: theme.colors.secondaryText,
  },
  replyRecipient: {
    fontFamily: theme.fontFamily.semibold,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  replyCancel: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
