import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  message: (isMe: boolean) => ({
    maxWidth: '82%',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    zIndex: 10,
    minHeight: 44,
    backgroundColor: isMe ? theme.colors.primary : theme.colors.foreground,
  }),
  messageWrapper: (isMe: boolean, isGrouped: boolean) => ({
    gap: theme.spacing.md,
    position: 'relative',
    paddingBottom: isGrouped ? theme.spacing.sm : theme.spacing.lg,
    alignItems: isMe ? 'flex-end' : 'flex-start',
  }),
  messageContent: {
    paddingHorizontal: theme.spacing.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    width: '100%',
  },
  text: (isMe: boolean) => ({
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    color: isMe ? theme.colors.white : theme.colors.text,
    textAlign: 'left',
  }),
  secondaryText: (isMe: boolean) => ({
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fontFamily.medium,
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.md - 2,
    color: isMe ? theme.colors.white : theme.colors.text,
    opacity: theme.opacity.contentText,
  }),
  metaRowText: {
    color: theme.colors.secondaryText,
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fontFamily.medium,
  },
  messageBubbleWrapper: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
