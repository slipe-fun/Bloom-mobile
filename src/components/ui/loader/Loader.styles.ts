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
    width: 3.5 * (size / 7),
    aspectRatio: 1,
    borderRadius: theme.radius.full,
    backgroundColor: color ? color : theme.colors.text,
  }),
}))
