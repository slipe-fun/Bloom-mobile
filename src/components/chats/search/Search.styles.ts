import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    flex: 1,
  },
  loaderWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fontFamily.semibold,
    marginTop: theme.spacing.lg,
  },
  emptySubTitle: {
    color: theme.colors.secondaryText,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyNotFound: {
    color: theme.colors.switcher,
    fontSize: theme.fontSize.xxxl,
    fontFamily: theme.fontFamily.semibold,
  },
  emptyWrapper: {
    justifyContent: 'center',
    maxWidth: 275,
    width: '100%',
    alignItems: 'center',
  },
}))
