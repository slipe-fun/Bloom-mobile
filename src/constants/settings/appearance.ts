import type { SettingsSection } from '@interfaces'

type SettingsSectionProps = {
  theme: string
  setTheme: (theme: string) => void
}

export const APPEARACNE_SECTIONS = ({ theme, setTheme }: SettingsSectionProps): SettingsSection[] => [
  {
    id: 'Automatic',
    items: [
      {
        label: 'settings.app.appearance.automatic',
        type: 'toggle',
        toggleValue: theme === 'auto',
        action: () => setTheme(theme === 'auto' ? 'dark' : 'auto'),
      },
    ],
  },
]
