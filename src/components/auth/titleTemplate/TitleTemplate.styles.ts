import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  titleContainer: {
    width: '100%',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.xxxl,
    textAlign: 'center',
    color: theme.colors.text,
  },
}))
