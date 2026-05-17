import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.modal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fontFamily.semibold,
    color: theme.colors.text,
  },
  subTitle: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    textAlign: 'center',
    color: theme.colors.secondaryText,
  },
  textContainer: {
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
}))
