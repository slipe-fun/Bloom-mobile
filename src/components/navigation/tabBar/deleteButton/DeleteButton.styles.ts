import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  deleteCharStack: {
    flexDirection: 'row',
    marginRight: theme.spacing.xs,
    alignItems: 'center',
  },
  deleteChar: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.white,
    transformOrigin: 'center',
    fontFamily: theme.fontFamily.semibold,
  },
  deleteWrapper: {
    gap: theme.spacing.sm,
    flexDirection: 'row',
    backgroundColor: theme.colors.red,
    borderRadius: theme.radius.full,
    minWidth: 48,
    height: 48,
    paddingHorizontal: theme.spacing.lg,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
