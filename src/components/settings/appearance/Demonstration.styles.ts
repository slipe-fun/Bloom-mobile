import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    borderBottomWidth: 1,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  pattern: {
    width: '100%',
    position: 'absolute',
    height: '100%',
    opacity: 0.75,
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.sectionForeground,
    borderWidth: 1,
  },
  message: (me: boolean) => ({
    width: '100%',
    padding: theme.spacing.xxl,
    paddingBottom: me ? theme.spacing.md : theme.spacing.xxl,
    justifyContent: me ? 'flex-end' : 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.md,
  }),
  avatar: {
    height: 36,
    width: 36,
    borderRadius: theme.radius.full,
  },
  messageBubble: (me: boolean) => ({
    backgroundColor: me ? theme.colors.primary : theme.colors.foreground,
    borderRadius: theme.radius.full,
    borderCurve: 'continuous',
    padding: theme.spacing.md,
    gap: theme.spacing.md / 2,
  }),
  messagePlaceholder: (me: boolean) => ({
    height: 16,
    opacity: me ? 0.35 : undefined,
    borderRadius: theme.radius.full,
    backgroundColor: me ? theme.colors.white : theme.colors.switcher,
    borderCurve: 'continuous',
  }),
}))
