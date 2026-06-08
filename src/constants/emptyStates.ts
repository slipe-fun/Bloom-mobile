import type { ChatsEmptyCardData, SettingsDemoMessageData } from '@interfaces'

// Chats screen

export const data: ChatsEmptyCardData[] = [
  { avatar: require('@assets/empty/1.png'), nameWidth: 4, messageWidth: 6 },
  { avatar: require('@assets/empty/2.png'), nameWidth: 3, messageWidth: 2.5 },
  { avatar: require('@assets/empty/3.png'), nameWidth: 3.5, messageWidth: 5 },
]

// Settings screen

export const settingsDemo: SettingsDemoMessageData[] = [
  { avatar: require('@assets/empty/1.png'), messageWidth: 9, me: true },
  { avatar: require('@assets/empty/2.png'), messageWidth: 10, me: false },
]
