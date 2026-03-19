import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  deleteCharStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteChar: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    transformOrigin: 'center',
    fontFamily: theme.fontFamily.semibold,
  },
  subTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.semibold,
  },
  container: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
}))
