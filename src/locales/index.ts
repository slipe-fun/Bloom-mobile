import enAuth from './en/auth.json'
import enChat from './en/chat.json'
import enCommon from './en/common.json'
import enSettings from './en/settings.json'
import ruAuth from './ru/auth.json'
import ruChat from './ru/chat.json'
import ruCommon from './ru/common.json'
import ruSettings from './ru/settings.json'

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    settings: enSettings,
    chat: enChat,
  },
  ru: {
    common: ruCommon,
    auth: ruAuth,
    settings: ruSettings,
    chat: ruChat,
  },
} as const
