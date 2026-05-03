import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.xxxl,
    paddingTop: theme.spacing.lg,
    bottom: 0,
    position: 'absolute',
    gap: theme.spacing.md,
    flexDirection: 'row',
    left: 0,
    right: 0,
    zIndex: 2,
  },
}))
