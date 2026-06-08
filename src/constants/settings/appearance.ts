import type { SettingsSection } from '@interfaces'
import type { JSX } from 'react'

type SettingsSectionProps = {
  theme: string
  demonstartion: JSX.Element
  setTheme: (theme: string) => void
}

export const APPEARACNE_SECTIONS = ({ theme, demonstartion, setTheme }: SettingsSectionProps): SettingsSection[] => [
  {
    id: 'Automatic',
    items: [
      {
        label: 'settings.app.appearance.automatic',
        type: 'toggle',
        toggleValue: theme === 'auto',
        action: () => setTheme(theme === 'auto' ? 'light' : 'auto'),
      },
    ],
  },
  {
    id: 'Appearance',
    title: 'settings.app.appearance.title',
    items: [
      {
        type: 'custom',
        children: demonstartion,
      },
      {
        label: 'settings.app.appearance.darkToggle',
        type: 'toggle',
        toggleValue: theme === 'dark',
        action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
    ],
  },
]
