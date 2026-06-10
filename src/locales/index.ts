import enAuth from './en/auth.json'
import enCommon from './en/common.json'
import enSettings from './en/settings.json'
import ruAuth from './ru/auth.json'
import ruCommon from './ru/common.json'
import ruSettings from './ru/settings.json'

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    settings: enSettings,
  },
  ru: {
    common: ruCommon,
    auth: ruAuth,
    settings: ruSettings,
  },
} as const
