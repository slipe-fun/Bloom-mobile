import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: (button: boolean, rightPadding: boolean) => ({
    flexDirection: 'row',
    width: '100%',
    paddingLeft: button ? theme.spacing.lg : 0,
    paddingRight: rightPadding ? undefined : theme.spacing.lg,
  }),
  label: (button: boolean, color: string) => ({
    fontSize: button ? theme.fontSize.lg : theme.fontSize.md,
    color: button ? theme.colors[color] : theme.colors.text,
    flex: button ? 0 : 1,
    fontFamily: theme.fontFamily.medium,
  }),
  content: (last: boolean, icon: boolean) => ({
    gap: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: icon ? undefined : theme.spacing.lg,
    flex: 1,
    borderBottomWidth: last ? undefined : 1,
    borderColor: last ? undefined : theme.colors.border,
    minHeight: 52,
  }),
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 32,
    minWidth: 32,
    gap: theme.spacing.sm,
  },
  badgeLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
}))
