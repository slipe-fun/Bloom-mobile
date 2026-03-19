import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  message: (isMe: boolean) => ({
    maxWidth: '82%',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    transformOrigin: 'right center',
    zIndex: 10,
    minHeight: 40,
    backgroundColor: isMe ? theme.colors.primary : theme.colors.foreground,
  }),
  messageWrapper: (isMe: boolean, marginBottom) => ({
    gap: theme.spacing.md,
    position: 'relative',
    justifyContent: 'center',
    marginBottom,
    alignItems: isMe ? 'flex-end' : 'flex-start',
  }),
  messageContent: {
    paddingHorizontal: theme.spacing.lg,
    padding: theme.spacing.md - 1,
    minHeight: 42,
    flexDirection: 'row',
    width: '100%',
  },
  text: (isMe: boolean) => ({
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.regular,
    textAlignVertical: 'center',
    color: isMe ? theme.colors.white : theme.colors.text,
  }),
  secondaryText: (isMe: boolean) => ({
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fontFamily.medium,
    position: 'absolute',
    right: theme.spacing.md + 2,
    bottom: theme.spacing.sm,
    color: isMe ? theme.colors.white : theme.colors.text,
    opacity: theme.opacity.secondaryText,
  }),
  statusCanvas: (height: number) => ({
    height,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    marginRight: -16,
    position: 'absolute',
  }),
}))
