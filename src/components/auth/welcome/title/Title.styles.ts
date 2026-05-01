import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.sm,
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  char: {
    fontSize: theme.fontSize.super,
    fontFamily: theme.fontFamily.bold,
    letterSpacing: -3,
    transformOrigin: 'center bottom 0px',
    color: theme.colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: theme.fontSize.lg,
    letterSpacing: -1,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  eye: {
    width: 64,
    height: 64,
  },
}))
