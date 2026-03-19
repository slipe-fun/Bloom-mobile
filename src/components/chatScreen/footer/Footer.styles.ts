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
}))
