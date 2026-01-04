import { randomBytes } from '@noble/hashes/utils'
import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { MMKV } from 'react-native-mmkv'

type StorageOptions = { secure?: boolean }

const SERVICE_PREFIX = 'com.bloom.storage'

const genKey = (): string => {
  const bytes = randomBytes(32)
  return global.btoa(String.fromCharCode(...bytes))
}

const getOrCreateKey = async (service: string): Promise<string> => {
  const existing = await Keychain.getGenericPassword({ service })
  if (existing) return existing.password

  const key = genKey()
  await Keychain.setGenericPassword('mmkv', key, {
    service,
    accessible: Platform.OS === 'ios' ? Keychain.ACCESSIBLE.WHEN_UNLOCKED : undefined,
    storage: Platform.OS === 'android' ? Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH : undefined,
  })
  return key
}

export const createSecureStorage = async (id: string, { secure = true }: StorageOptions = {}): Promise<MMKV> => {
  if (!secure) return new MMKV({ id })

  const service = `${SERVICE_PREFIX}.${id}.${Platform.OS}`
  const key = await getOrCreateKey(service)
  return new MMKV({ id, encryptionKey: key })
}
