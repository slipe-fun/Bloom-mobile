import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fontFamily.semibold,
    marginTop: theme.spacing.lg,
  },
  subTitle: {
    color: theme.colors.secondaryText,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    textAlign: 'center',
  },
  wrapper: {
    justifyContent: 'center',
    maxWidth: 275,
    width: '100%',
    alignItems: 'center',
  },
  subTitleWrapper: {
    width: '100%',
    marginTop: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  action: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.semibold,
  },
}))
