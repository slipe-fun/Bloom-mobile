import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  floatingHeader: (paddingTop: number) => ({
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    paddingTop,
    position: 'absolute',
    alignItems: 'center',
    paddingBottom: theme.spacing.md,
  }),
  title: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xxl - 4,
    fontFamily: theme.fontFamily.semibold,
  },
}))
