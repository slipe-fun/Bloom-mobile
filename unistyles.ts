import { darkTheme, lightTheme } from '@design/themes'
import { createStorage } from '@lib/storage'
import { StyleSheet } from 'react-native-unistyles'

const settingsStorage = createStorage('settings')

const getInitialThemeMode = (): 'light' | 'dark' | 'auto' => {
  try {
    const state = settingsStorage.getString('app-settings-storage')
    if (state) {
      const parsed = JSON.parse(state)
      return parsed.state?.theme || 'auto'
    }
  } catch (_e) {}
  return 'auto'
}

const initialMode = getInitialThemeMode()

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
}

const settings = initialMode === 'auto' ? { adaptiveThemes: true } : { initialTheme: initialMode }

StyleSheet.configure({
  themes: appThemes,
  //@ts-expect-error
  settings,
})

type AppThemes = typeof appThemes

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}
