import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.md,
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingBottom: 140,
  },
  char: {
    fontSize: theme.fontSize.super,
    fontFamily: theme.fontFamily.bold,
    letterSpacing: -3,
    transformOrigin: 'center bottom 0px',
    color: theme.colors.text,
  },
  bloom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: theme.fontSize.xl,
    letterSpacing: -1,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
}))
