import { randomBytes } from '@noble/hashes/utils.js'
import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { createMMKV, type MMKV } from 'react-native-mmkv'

const SERVICE_PREFIX = 'pw.bloom.storage'

const storageInstances = new Map<string, MMKV>()
const initializationPromises = new Map<string, Promise<MMKV>>()

const genKey = (): string => {
  const bytes = randomBytes(32)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

const getOrCreateKey = async (service: string): Promise<string> => {
  try {
    const existing = await Keychain.getGenericPassword({ service })
    if (existing) {
      return existing.password
    }
  } catch (error) {
    console.error(`[Storage] Failed to read key for ${service}, resetting...`, error)
    await Keychain.resetGenericPassword({ service })
  }

  const key = genKey()
  const success = await Keychain.setGenericPassword('mmkv', key, {
    service,
    accessible: Platform.OS === 'ios' ? Keychain.ACCESSIBLE.WHEN_UNLOCKED : undefined,
    storage: Platform.OS === 'android' ? Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH : undefined,
  })

  if (!success) {
    throw new Error(`[Storage] Keychain is not supported or failed to save the key for ${service}`)
  }

  return key
}

export const createStorage = (id: string): MMKV => {
  const cacheKey = `regular:${id}`
  if (storageInstances.has(cacheKey)) {
    return storageInstances.get(cacheKey)!
  }

  const storage = createMMKV({ id })
  storageInstances.set(cacheKey, storage)
  return storage
}

const _initSecureStorage = async (id: string): Promise<MMKV> => {
  const service = `${SERVICE_PREFIX}.${id}`
  const key = await getOrCreateKey(service)
  const cacheKey = `secure:${id}`

  try {
    const storage = createMMKV({ id, encryptionKey: key })
    storageInstances.set(cacheKey, storage)
    return storage
  } catch (error) {
    console.error(`[Storage] Failed to open encrypted MMKV instance for ${id}, wiping data...`, error)

    const rescueStorage = createMMKV({ id })
    rescueStorage.clearAll()

    const freshStorage = createMMKV({ id, encryptionKey: key })
    storageInstances.set(cacheKey, freshStorage)
    return freshStorage
  } finally {
    initializationPromises.delete(id)
  }
}

export const createSecureStorage = async (id: string): Promise<MMKV> => {
  const cacheKey = `secure:${id}`

  if (storageInstances.has(cacheKey)) {
    return storageInstances.get(cacheKey)!
  }

  if (initializationPromises.has(id)) {
    return initializationPromises.get(id)!
  }

  const promise = _initSecureStorage(id)
  initializationPromises.set(id, promise)

  return promise
}
