import { randomBytes } from '@noble/hashes/utils.js'
import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { createMMKV, type MMKV } from 'react-native-mmkv'

const SERVICE_PREFIX = 'com.bloom.storage'

const genKey = (): string => {
  const bytes = randomBytes(32)
  return global.btoa(String.fromCharCode(...bytes))
}

const getOrCreateKey = async (service: string): Promise<string> => {
  const existing = await Keychain.getGenericPassword({ service })
  if (existing) return existing.password

  const key = genKey()
  const success = await Keychain.setGenericPassword('mmkv', key, {
    service,
    accessible: Platform.OS === 'ios' ? Keychain.ACCESSIBLE.WHEN_UNLOCKED : undefined,
    storage: Platform.OS === 'android' ? Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH : undefined,
  })

  if (!success) {
    throw new Error('Keychain is not supported or failed to save the key')
  }

  return key
}

export const createStorage = (id: string): MMKV => {
  return createMMKV({ id })
}

export const createSecureStorage = async (id: string): Promise<MMKV> => {
  const service = `${SERVICE_PREFIX}.${id}.${Platform.OS}`

  try {
    const key = await getOrCreateKey(service)
    return createMMKV({ id, encryptionKey: key })
  } catch (error) {
    console.warn(`[Storage] Secure storage initialization failed for id: "${id}". Falling back to unencrypted storage.`, error)
    return createStorage(id)
  }
}
