import 'i18next'
import type auth from '../locales/en/auth.json'
import type common from '../locales/en/common.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      settings: typeof settings
      auth: typeof auth
    }
    returnNull: false
  }
}
