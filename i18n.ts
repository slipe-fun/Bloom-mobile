import { createStorage } from '@lib/storage'
import i18n, { type LanguageDetectorModule } from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import { resources } from 'src/locales'

const STORE_KEY = 'settings'
const STORE_LANGUAGE_KEY = 'settings.lang'

const storage = createStorage(STORE_KEY)

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  detect: () => {
    try {
      const savedLanguage = storage.getString(STORE_LANGUAGE_KEY)
      if (savedLanguage) {
        return savedLanguage
      }

      const bestLng = RNLocalize.findBestLanguageTag(Object.keys(resources))
      if (bestLng) {
        return bestLng.languageTag
      }

      return 'en'
    } catch (error) {
      console.error('Error reading language from MMKV', error)
      return 'en'
    }
  },
  cacheUserLanguage: (language: string) => {
    try {
      storage.set(STORE_LANGUAGE_KEY, language)
    } catch (error) {
      console.error('Error saving language to MMKV', error)
    }
  },
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',

    ns: ['common', 'auth'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
