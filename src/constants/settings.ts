import type { SettingsSection } from '@interfaces'
import type { Route } from 'expo-router'
import type { MMKV } from 'react-native-mmkv'

type SettingsSectionProps = {
  theme: string
  language: string
  storage: MMKV
  push: (path: Route) => void
}

export const SETTINGS_SECTIONS = ({ theme, language, push, storage }: SettingsSectionProps): SettingsSection[] => [
  {
    id: 'Account',
    title: 'settings.profile.title',
    items: [
      {
        action: () => push('/(app)/chat/[chat]'),
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
  {
    id: 'dev',
    title: 'Developer options',
    items: [
      {
        color: 'red',
        type: 'button',
        action: () => storage.clearAll(),
        label: 'Clear MMKV (Reload)',
      },
    ],
  },
]
