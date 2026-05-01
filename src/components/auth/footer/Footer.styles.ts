import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  footer: {
    width: '100%',
    position: 'absolute',
    gap: theme.spacing.md,
    paddingHorizontal: 36,
    paddingBottom: 36,
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
  buttonLabel: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.semibold,
    color: theme.colors.white,
  },
  partsContainer: {
    flexDirection: 'row',
  },
}))
