import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  header: (paddingTop: number) => ({
    paddingTop,
    zIndex: 1,
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    alignItems: 'flex-start',
  }),
  title: (large: boolean = false) => ({
    fontFamily: large ? theme.fontFamily.bold : theme.fontFamily.semibold,
    fontSize: large ? theme.fontSize.xxxl : theme.fontSize.lg,
    color: theme.colors.text,
  }),
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
}))
