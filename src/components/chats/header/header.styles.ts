import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  header: (paddingTop: number) => ({
    position: 'absolute',
    width: '100%',
    paddingHorizontal: theme.spacing.xxl,
    paddingLeft: theme.spacing.xxl - theme.spacing.xxs,
    paddingBottom: theme.spacing.lg,
    paddingTop,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
  }),
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fontFamily.bold,
  },
  buttonBackground: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
  },
}))
