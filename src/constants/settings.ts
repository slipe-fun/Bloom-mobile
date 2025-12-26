import { MenuItem } from "@interfaces";

export const SETTINGS: MenuItem[] = [
  /* First block */
  {
    icon: "at",
    iconType: "transparent",
    label: "username",
    color: null,
    first: true,
    badgeIcon: "file",
  },
  {
    icon: "person",
    iconType: "transparent",
    label: "username",
    color: null,
    last: true,
    badgeIcon: "file",
  },
  /* */

  /* Second block */
  {
    icon: "person.circle",
    iconType: "gradient",
    label: "Мой профиль",
    color: "orange",
    single: true,
  },
  /* */

  /* Third block */
  {
    icon: "person.circle",
    iconType: "gradient",
    label: "Аккаунт",
    color: "primary",
    first: true,
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
    last: true,
  },
  /* */

  /* Fourth block */
  {
    icon: "person",
    iconType: "gradient",
    label: "Друзья",
    color: "primary",
    badgeLabel: "friendsCount",
    single: true,
  },
  /* */

  /* Fiveth block */
  {
    icon: "sun",
    iconType: "gradient",
    label: "Оформление",
    color: "yellow",
    badgeLabel: "currentTheme",
    first: true,
  },
  {
    icon: "globe",
    iconType: "gradient",
    label: "Язык",
    color: "primary",
    badgeLabel: "currentLanguage",
    first: true,
  },
  {
    icon: "message",
    iconType: "gradient",
    label: "Чаты",
    color: "green",
    first: true,
  },
  {
    icon: "bell",
    iconType: "gradient",
    label: "Уведомления и звуки",
    color: "orange",
    first: true,
  },
  {
    icon: "phone",
    iconType: "gradient",
    label: "Устройства",
    color: "gray",
    first: true,
  },
  /* */

  /* Sixth block */
  {
    icon: "message",
    iconType: "gradient",
    label: "Поддержка",
    color: "primary",
    first: true,
  },
  {
    icon: "compass",
    iconType: "gradient",
    label: "Спец. возможности",
    color: "purple",
    first: true,
  },
  {
    icon: "questionmark.circle",
    iconType: "gradient",
    label: "О приложении",
    color: "gray",
    first: true,
  },
  /* */
] as const;
