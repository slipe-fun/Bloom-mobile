import type { SettingsSection } from '@interfaces'
import type { JSX } from 'react'

type SettingsSectionProps = {
  theme: string
  demonstartion: JSX.Element
  setTheme: (theme: string) => void
}

export const APPEARANCE_SECTIONS = ({ theme, demonstartion, setTheme }: SettingsSectionProps): SettingsSection[] => [
  {
    id: 'Automatic',
    items: [
      {
        label: 'app.appearance.automatic',
        type: 'toggle',
        toggleValue: theme === 'auto',
        action: () => setTheme(theme === 'auto' ? 'light' : 'auto'),
      },
    ],
  },
  {
    id: 'Appearance',
    title: 'app.appearance.title',
    items: [
      {
        type: 'custom',
        children: demonstartion,
      },
      {
        label: 'app.appearance.darkToggle',
        type: 'toggle',
        disabled: theme === 'auto',
        toggleValue: theme === 'dark',
        action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
    ],
  },
]
