import type { SettingsSection } from '@interfaces'

type SettingsSectionProps = {
  theme: string
  language: string
}

export const SETTINGS_SECTIONS = ({ theme, language }: SettingsSectionProps): SettingsSection[] => [
  {
    id: 'Account',
    title: 'settings.profile.title',

    items: [
      {
        icon: 'person.circle',
        label: 'settings.profile.myProfile',
      },
    ],
  },
  {
    id: 'appSettings',
    title: 'settings.app.title',

    items: [
      {
        icon: 'sun',
        label: 'settings.app.appearance',
        badgeLabel: theme,
      },
      {
        icon: 'globe',
        label: 'settings.app.language',
        badgeLabel: language,
      },
    ],
  },
  {
    id: 'security',
    title: 'settings.privacy.title',
    items: [
      {
        icon: 'key',
        label: 'settings.privacy.keyPassword',
      },
    ],
  },
  {
    id: 'dangerZone',
    title: 'settings.account.title',
    items: [
      {
        label: 'settings.account.logout',
        color: 'red',
        type: 'button',
      },
    ],
  },
]
