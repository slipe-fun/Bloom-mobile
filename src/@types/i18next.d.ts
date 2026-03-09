import 'i18next'

import type auth from '../locales/en/auth.json'
// 1. Импортируем именно английские JSON-файлы напрямую
import type common from '../locales/en/common.json'

// добавь остальные, если есть

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'

    // 2. Явно прописываем структуру неймспейсов
    resources: {
      common: typeof common
      auth: typeof auth
    }

    // 3. Обязательный флаг для React Native / новых версий i18next,
    // иначе TS будет ругаться на возвращаемый тип null
    returnNull: false
  }
}
