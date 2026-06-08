import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
    overflow: 'visible',
  },
  group: {
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: theme.colors.sectionForeground,
    borderRadius: theme.radius.xl,
  },
  title: {
    marginHorizontal: theme.radius.xxl / 2,
    fontSize: theme.fontSize.md,
    color: theme.colors.secondaryText,
    fontFamily: theme.fontFamily.medium,
  },
}))
