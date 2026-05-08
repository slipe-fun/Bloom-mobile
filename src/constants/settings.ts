import type { SettingsSection } from '@interfaces'

type SettingsSectionProps = {
  theme: string
  language: string
}

export const SETTINGS_SECTIONS = ({ theme, language }: SettingsSectionProps): SettingsSection[] => [
  {
    id: 'Account',
    items: [
      {
        icon: 'person.circle',
        iconType: 'gradient',
        label: 'Мой профиль',
        color: 'orange',
      },
    ],
  },
  {
    id: 'appSettings',
    items: [
      {
        icon: 'sun',
        iconType: 'gradient',
        label: 'Оформление',
        badgeLabel: theme,
        color: 'yellow',
      },
      {
        icon: 'globe',
        iconType: 'gradient',
        label: 'Язык',
        badgeLabel: language,
        color: 'primary',
      },
    ],
  },
  {
    id: 'security',
    items: [
      {
        icon: 'key',
        iconType: 'gradient',
        label: 'Ключи шифрования',
        color: 'purple',
      },
    ],
  },
  {
    id: 'dangerZone',
    description: 'При выходе из аккаунта все ваши ключи будут сброшены. Чтобы восстановить их, потребуется снова ввести пароль',
    items: [
      {
        iconType: 'gradient',
        label: 'Выйти из аккаунта',
        color: 'red',
        type: 'button',
      },
    ],
  },
]
