import { randomBytes } from '@noble/hashes/utils.js'
import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { createMMKV, type MMKV } from 'react-native-mmkv'

const SERVICE_PREFIX = 'pw.bloom.storage'

const systemStorage = createMMKV({ id: 'system-storage' })

const genKey = (): string => {
  const bytes = randomBytes(32)
  return global.btoa(String.fromCharCode(...bytes))
}

// Did some cool code for secure storage, because some cheap ass androids cannot use secure keychain, so it's just fallback to simple secure storage
// Pip did it wrong, Dikiy did it cool as always

const getOrCreateKey = async (service: string): Promise<string> => {
  try {
    // Perfect key
    const existing = await Keychain.getGenericPassword({ service })
    if (existing) return existing.password
    const key = genKey()
    const success = await Keychain.setGenericPassword('mmkv', key, {
      service,
      accessible: Platform.OS === 'ios' ? Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY : undefined,
      storage: Platform.OS === 'android' ? Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH : undefined,
    })

    if (!success) {
      throw new Error('Keychain is not supported or failed to save the key')
    }

    return key
  } catch (_err) {
    // Fallback
    const fallbackKeyName = `fallback-${service}`
    let fallbackKey = systemStorage.getString(fallbackKeyName)

    if (!fallbackKey) {
      fallbackKey = genKey()
      systemStorage.set(fallbackKeyName, fallbackKey)
    }
    return fallbackKey
  }
}

export const createStorage = (id: string): MMKV => {
  return createMMKV({ id })
}

export const createSecureStorage = async (id: string): Promise<MMKV> => {
  const service = `${SERVICE_PREFIX}.${id}.${Platform.OS}`

  const key = await getOrCreateKey(service)

  return createMMKV({ id, encryptionKey: key })
}
