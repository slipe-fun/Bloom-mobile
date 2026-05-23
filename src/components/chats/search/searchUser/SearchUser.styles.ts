import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  chat: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    marginHorizontal: theme.spacing.lg,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm - 2,
    height: '100%',
    paddingBottom: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  name: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fontFamily.semibold,
  },
  username: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
}))
