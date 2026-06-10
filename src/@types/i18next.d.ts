import 'i18next'
import type auth from '../locales/en/auth.json'
import type chat from '../locales/en/chat.json'
import type common from '../locales/en/common.json'
import type settings from '../locales/en/settings.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      settings: typeof settings
      auth: typeof auth
      chat: typeof chat
    }
    returnNull: false
  }
}
