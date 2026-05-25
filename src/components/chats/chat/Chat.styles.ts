import { SIZE_MAP } from '@components/ui/avatar'
import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  chat: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  content: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm - 2,
    height: '100%',
    paddingRight: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  name: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginRight: theme.spacing.md,
    flex: 1,
    fontFamily: theme.fontFamily.semibold,
  },
  secondary: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
  separator: (size: string = 'lg') => ({
    left: 0,
    right: 0,
    marginLeft: SIZE_MAP[size] + theme.spacing.lg * 2,
    height: 1,
    bottom: 0,
    marginRight: theme.spacing.lg,
    position: 'absolute',
    backgroundColor: theme.colors.foreground,
  }),
}))
