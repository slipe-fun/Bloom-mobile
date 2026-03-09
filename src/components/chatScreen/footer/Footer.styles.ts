import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  footer: {
    width: '100%',
    paddingTop: theme.spacing.md,
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 0,
    gap: theme.spacing.md,
  },
  buttonBackground: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
}))
