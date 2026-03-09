import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: (size: number) => ({
    width: size,
    height: size,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  bar: (color: string, size: number) => ({
    position: 'absolute',
    width: 2 * (size / 6.4),
    height: 6 * (size / 7),
    borderRadius: theme.radius.full,
    backgroundColor: color ? color : theme.colors.text,
  }),
}))
