import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
    position: 'relative',
  },
  cell: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.foreground,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: (disabled?: boolean) => ({
    fontSize: theme.fontSize.xxl,
    zIndex: disabled ? 1 : 2,
    fontFamily: theme.fontFamily.semibold,
    color: disabled ? theme.colors.secondaryText : theme.colors.text,
  }),
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    zIndex: 2,
  },
  indicator: {
    position: 'absolute',
    aspectRatio: 3 / 4,
    zIndex: 2,
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  separator: {
    height: 2,
    width: 16,
    backgroundColor: theme.colors.secondaryText,
    borderRadius: theme.radius.full,
    borderCurve: 'continuous',
  },
}))
