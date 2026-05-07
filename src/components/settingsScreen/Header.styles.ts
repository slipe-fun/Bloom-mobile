import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    zIndex: 2,
    position: 'absolute',
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fontFamily.semibold,
  },
  subTitle: {
    color: theme.colors.secondaryText,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  gradientWrapper: (height: number) => ({
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    height,
  }),
  avatar: {
    boxShadow: `${theme.shadows.pressable} ${theme.colors.shadow}`,
  },
}))
