import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  track: (height, width) => ({
    width,
    height,
    borderRadius: theme.radius.full,
    padding: theme.spacing.xxs,
    justifyContent: 'center',
    borderCurve: 'continuous',
  }),
  thumb: (height, width) => ({
    height,
    width,
    borderRadius: theme.radius.full,
    borderCurve: 'continuous',
    backgroundColor: theme.colors.white,
    boxShadow: `${theme.shadows.pressable} ${theme.colors.shadow}`,
  }),
  wrapper: {
    padding: theme.spacing.md - 1,
  },
}))
