import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: (size: number) => ({
    width: size,
    height: size,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  bar: (color?: string) => ({
    position: 'absolute',
    width: 2,
    height: 6,
    borderRadius: 99,
    backgroundColor: color ? color : theme.colors.primary,
  }),
}))
