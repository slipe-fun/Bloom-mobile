import enAuth from './en/auth.json'
import enCommon from './en/common.json'
import ruAuth from './ru/auth.json'
import ruCommon from './ru/common.json'

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
  },
  ru: {
    common: ruCommon,
    auth: ruAuth,
  },
} as const
