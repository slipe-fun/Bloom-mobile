import type decryptKey from './decryptKey'
import type encryptKey from './encryptKey'
import type { decryptKeys, encryptKeys, hashPassword } from './encryptKeys'
import type generateKeys from './generateKeys'
import type { decrypt as sskDecrypt, encrypt as sskEncrypt } from './serversideKeyEncryption'

export type SKIDModuleType = {
  local: {
    generateKeys: typeof generateKeys
    encryptKey: typeof encryptKey
    decryptKey: typeof decryptKey
  }
  aes: {
    encrypt: typeof sskEncrypt
    decrypt: typeof sskDecrypt
  }
  server: {
    hashPassword: typeof hashPassword
    encryptKeys: typeof encryptKeys
    decryptKeys: typeof decryptKeys
  }
}

let skidModule: SKIDModuleType | null = null

export async function getSKID() {
  if (!skidModule) {
    skidModule = (await import('./protocol')).default
  }
  return skidModule
}
