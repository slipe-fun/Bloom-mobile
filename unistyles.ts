import { darkTheme, lightTheme } from '@design/themes'
import { StyleSheet } from 'react-native-unistyles'

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  themes: appThemes,
})

type AppThemes = typeof appThemes

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}
