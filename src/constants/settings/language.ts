import type { SettingsSection } from '@interfaces'
import type { AppLanguage } from '@stores/settings'

type SettingsSectionProps = {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
}

export const LANGUAGE_SECTIONS = ({ language, setLanguage }: SettingsSectionProps): SettingsSection[] => [
  {
    id: 'Language',
    title: 'app.language.sectionTitle',
    items: [
      {
        label: 'app.appearance.darkToggle',
        type: 'select',
        toggleValue: language === 'ru',
        action: () => setLanguage('ru'),
      },
      {
        label: 'app.appearance.darkToggle',
        type: 'select',
        toggleValue: language === 'en',
        action: () => setLanguage('en'),
      },
    ],
  },
]
