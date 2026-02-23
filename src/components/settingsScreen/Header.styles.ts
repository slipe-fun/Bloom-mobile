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
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl - 4,
    fontFamily: theme.fontFamily.semibold,
  },
  subTitle: {
    color: theme.colors.secondaryText,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
}))
