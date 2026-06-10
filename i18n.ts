import { type AppLanguage, useSettingsStore } from '@stores/settings'
import i18n, { type LanguageDetectorModule } from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import { resources } from 'src/locales'

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  detect: () => {
    const savedLanguage = useSettingsStore.getState().language
    if (savedLanguage) {
      return savedLanguage
    }

    const bestLng = RNLocalize.findBestLanguageTag(Object.keys(resources))
    if (bestLng) {
      return bestLng.languageTag
    }

    return 'en'
  },
  cacheUserLanguage: (language: AppLanguage) => {
    const currentStoreLang = useSettingsStore.getState().language

    if (currentStoreLang !== language) {
      useSettingsStore.setState({ language: language })
    }
  },
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',

    ns: ['common', 'auth', 'settings'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
