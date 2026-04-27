import { Buffer } from '@craftzdog/react-native-buffer'
import { randomBytes } from '@noble/hashes/utils.js'
import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { createMMKV, existsMMKV, type MMKV } from 'react-native-mmkv'

const CURRENT_SERVICE_PREFIX = 'pw.bloom.storage'
const LEGACY_SERVICE_PREFIXES = ['com.bloom.storage']
const FALLBACK_KEY_PREFIX = 'fallback-'

const systemStorage = createMMKV({ id: 'system-storage' })
const secureStoragePromises = new Map<string, Promise<MMKV>>()

const genKey = (): string => {
  const bytes = randomBytes(32)
  return Buffer.from(bytes).toString('base64')
}

const getServiceName = (prefix: string, id: string): string => `${prefix}.${id}.${Platform.OS}`

const getFallbackKeyName = (service: string): string => `${FALLBACK_KEY_PREFIX}${service}`

const getKeychainOptions = (service: string) => ({
  service,
  accessible: Platform.OS === 'ios' ? Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY : undefined,
  storage: Platform.OS === 'android' ? Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH : undefined,
})

const readKeychainKey = async (service: string): Promise<string | null> => {
  try {
    const existing = await Keychain.getGenericPassword({ service })
    return existing ? existing.password : null
  } catch {
    return null
  }
}

const readFallbackKey = (service: string): string | null => {
  return systemStorage.getString(getFallbackKeyName(service)) ?? null
}

const getExistingKey = async (service: string): Promise<string | null> => {
  const keychainKey = await readKeychainKey(service)

  if (keychainKey) {
    return keychainKey
  }

  return readFallbackKey(service)
}

const persistKey = async (service: string, key: string): Promise<void> => {
  try {
    const success = await Keychain.setGenericPassword('mmkv', key, getKeychainOptions(service))

    if (success) {
      systemStorage.remove(getFallbackKeyName(service))
      return
    }
  } catch {}

  systemStorage.set(getFallbackKeyName(service), key)
}

const getOrCreateKey = async (service: string): Promise<string> => {
  const existingKey = await getExistingKey(service)

  if (existingKey) {
    return existingKey
  }

  const key = genKey()
  await persistKey(service, key)
  return key
}

export const createStorage = (id: string): MMKV => {
  return createMMKV({ id })
}

const openMMKV = (id: string, encryptionKey?: string): MMKV => {
  return encryptionKey ? createMMKV({ id, encryptionKey }) : createMMKV({ id })
}

const tryOpenMMKV = (id: string, encryptionKey?: string): MMKV | null => {
  try {
    return openMMKV(id, encryptionKey)
  } catch {
    return null
  }
}

const migratePlaintextStorage = (id: string, encryptionKey: string): MMKV | null => {
  if (!existsMMKV(id)) {
    return null
  }

  try {
    const plaintextStorage = openMMKV(id)
    plaintextStorage.recrypt(encryptionKey)
    return openMMKV(id, encryptionKey)
  } catch {
    return null
  }
}

const createSecureStorageInternal = async (id: string): Promise<MMKV> => {
  const currentService = getServiceName(CURRENT_SERVICE_PREFIX, id)
  const currentKey = await getExistingKey(currentService)

  if (currentKey) {
    const currentStorage = tryOpenMMKV(id, currentKey)

    if (currentStorage) {
      return currentStorage
    }

    console.warn(`[Storage] Failed to open "${id}" with current key. Trying legacy recovery.`)
  }

  for (const prefix of LEGACY_SERVICE_PREFIXES) {
    const legacyService = getServiceName(prefix, id)
    const legacyKey = await getExistingKey(legacyService)

    if (!legacyKey) {
      continue
    }

    const legacyStorage = tryOpenMMKV(id, legacyKey)

    if (!legacyStorage) {
      continue
    }

    await persistKey(currentService, legacyKey)
    console.warn(`[Storage] Restored "${id}" using legacy service "${legacyService}".`)
    return legacyStorage
  }

  const key = currentKey ?? (await getOrCreateKey(currentService))
  const migratedStorage = migratePlaintextStorage(id, key)

  if (migratedStorage) {
    console.warn(`[Storage] Migrated plaintext MMKV "${id}" to encrypted storage.`)
    return migratedStorage
  }

  try {
    return openMMKV(id, key)
  } catch (error) {
    console.warn(`[Storage] Falling back to plain MMKV for "${id}".`, error)
    return createStorage(id)
  }
}

export const createSecureStorage = async (id: string): Promise<MMKV> => {
  const existingPromise = secureStoragePromises.get(id)

  if (existingPromise) {
    return existingPromise
  }

  const pendingPromise = createSecureStorageInternal(id).finally(() => {
    secureStoragePromises.delete(id)
  })

  secureStoragePromises.set(id, pendingPromise)
  return pendingPromise
}
