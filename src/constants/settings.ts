import type { SettingsSection } from "@interfaces";

type SettingsSectionProps = {
    username: string;
    description: string;
    friends: number;
    theme: string;
    language: string;
}

export const SETTINGS_SECTIONS = ({username, description, friends, theme, language}: SettingsSectionProps): SettingsSection[] => ([
  {
    id: "userInfo",
    items: [
      {
        icon: "at",
        iconType: "transparent",
        label: username,
        color: null,
        badgeIcon: "file",
      },
      {
        icon: "person",
        iconType: "transparent",
        label: description,
        color: null,
      },
    ],
  },
  {
    id: "profileMain",
    items: [
      {
        icon: "person.circle",
        iconType: "gradient",
        label: "Мой профиль",
        color: "orange",
      },
    ],
  },
  {
    id: "security",
    items: [
      {
        icon: "person.circle",
        iconType: "gradient",
        label: "Аккаунт",
        color: "primary",
      },
      {
        icon: "key",
        iconType: "gradient",
        label: "Ключи шифрования",
        color: "purple",
      },
      {
        icon: "lock",
        iconType: "gradient",
        label: "Приватность",
        color: "green",
      },
    ],
  },
   {
    id: "activities",
    items: [
      {
        icon: "person",
        iconType: "gradient",
        label: "Друзья",
        badgeLabel: friends,
        color: "primary",
      },
    ],
  },
  {
    id: "appSettings",
    items: [
      {
        icon: "sun",
        iconType: "gradient",
        label: "Оформление",
        badgeLabel: theme,
        color: "yellow",
      },
      {
        icon: "globe",
        iconType: "gradient",
        label: "Язык",
        badgeLabel: language,
        color: "primary",
      },
      {
        icon: "message",
        iconType: "gradient",
        label: "Чаты",
        color: "green",
      },
       {
        icon: "bell",
        iconType: "gradient",
        label: "Уведомления и звуки",
        color: "orange",
      },
       {
        icon: "phone",
        iconType: "gradient",
        label: "Устройства",
        color: "gray",
      },
    ],
  },
]);