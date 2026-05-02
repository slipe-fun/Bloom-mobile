import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.xxxl,
    paddingTop: theme.spacing.lg,
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    left: 0,
    right: 0,
    zIndex: 2,
  },
}))
