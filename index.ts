import 'fast-text-encoding'

import { Buffer } from '@craftzdog/react-native-buffer'

global.Buffer = Buffer as any

import { install } from 'react-native-quick-crypto'

install()

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = global.crypto
}

import 'unistyles.ts'
import 'i18n.ts'

import 'expo-router/entry'

install()
