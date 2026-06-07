import { createStorage } from '@lib/storage'
import { UnistylesRuntime, type UnistylesThemes } from 'react-native-unistyles'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeMode = keyof UnistylesThemes | 'auto'
export type AppLanguage = 'ru' | 'en'

interface SettingsState {
  theme: ThemeMode
  language: AppLanguage

  setTheme: (mode: ThemeMode) => void
  setLanguage: (lang: AppLanguage) => void
}

const settingsStorage = createStorage('settings')

const MMKVStorage = {
  setItem: (name: string, value: string) => settingsStorage.set(name, value),
  getItem: (name: string) => settingsStorage.getString(name) ?? null,
  removeItem: (name: string) => {
    settingsStorage.remove(name)
  },
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'auto',
      language: 'ru',

      setTheme: (mode) => {
        set({ theme: mode })

        if (mode === 'auto') {
          UnistylesRuntime.setAdaptiveThemes(true)
        } else {
          UnistylesRuntime.setAdaptiveThemes(false)
          UnistylesRuntime.setTheme(mode)
        }
      },

      setLanguage: (lang) => {
        set({ language: lang })
      },
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => MMKVStorage),
    },
  ),
)
