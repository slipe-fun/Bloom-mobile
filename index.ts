import 'fast-text-encoding'
import 'unistyles.ts'
import 'i18n.ts'
import 'expo-router/entry'
import { Buffer } from '@craftzdog/react-native-buffer'
import { install } from 'react-native-quick-crypto'

global.Buffer = Buffer as any

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = global.crypto
}

install()
