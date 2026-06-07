import { queryClient } from '@api/queryClient'
import type { SettingsSection } from '@interfaces'
import { resetE2EEKey } from '@lib/icloud_keychain_storage'
import type { Route } from 'expo-router'
import type { MMKV } from 'react-native-mmkv'
import { database } from 'src/db'

type SettingsSectionProps = {
  theme: string
  language: string
  storage: MMKV
  push: (path: Route) => void
  replace: (path: Route) => void
}

export const SETTINGS_SECTIONS = ({ theme, language, push, storage, replace }: SettingsSectionProps): SettingsSection[] => [
  {
    id: 'Account',
    title: 'settings.profile.title',
    items: [
      {
        icon: 'person.circle',
        label: 'settings.profile.myProfile',
        action: () => push('/(app)/(settings)/Profile'),
      },
    ],
  },
  {
    id: 'appSettings',
    title: 'settings.app.title',

    items: [
      {
        icon: 'globe',
        label: 'settings.app.language',
        action: () => push('/(app)/(settings)/Language'),
        badgeLabel: language,
      },
      {
        icon: 'sun',
        label: 'settings.app.appearance.title',
        action: () => push('/(app)/(settings)/Appearance'),
        badgeLabel: theme,
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
        action: () => push('/(app)/(settings)/KeyPassword'),
      },
    ],
  },
  {
    id: 'dangerZone',
    title: 'settings.account.title',
    items: [
      {
        label: 'settings.account.logout',
        action: async () => {
          storage.clearAll()
          database.write(async () => await database.unsafeResetDatabase())
          queryClient.clear()
          replace('/(auth)/Welcome')
        },
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
      {
        color: 'red',
        type: 'button',
        action: () => resetE2EEKey(),
        label: 'Clear iCloud',
      },
      {
        color: 'red',
        type: 'button',
        action: () => queryClient.clear(),
        label: 'Clear Query Cache',
      },
    ],
  },
]
