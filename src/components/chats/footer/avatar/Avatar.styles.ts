import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  avatar: {
    boxShadow: `${theme.shadows.pressable} ${theme.colors.shadow}`,
  },
}))
