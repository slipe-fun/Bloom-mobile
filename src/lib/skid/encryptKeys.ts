import { Buffer } from '@craftzdog/react-native-buffer'
import { gcmsiv } from '@noble/ciphers/aes.js'
import type { Cipher } from '@noble/ciphers/utils.js'
import { randomBytes } from '@noble/hashes/utils.js'
import QuickCrypto, { type BinaryLike } from 'react-native-quick-crypto'
import type { Keys } from './types/keys'

interface HashedPassword {
  hash: Buffer
  salt: Uint8Array
}

interface EncryptedKeys {
  ciphertext: string
  nonce: string
}

interface ChatKeys extends Keys {
  chat_id: number
}

export async function hashPassword(password: BinaryLike | Buffer, salt?: Uint8Array): Promise<HashedPassword> {
  const _salt: Uint8Array = salt ? salt : randomBytes(16)

  return new Promise((resolve, reject) => {
    QuickCrypto.pbkdf2(password, _salt, 600000, 32, 'sha256', (err, hash) => {
      if (err) return reject(err)
      if (!hash) return reject(new Error('Hash generation failed'))

      resolve({
        hash: hash,
        salt: _salt,
      })
    })
  })
}

export function encryptKeys(key: Uint8Array, content: Uint8Array): EncryptedKeys {
  const nonce: Uint8Array = randomBytes(12)
  const aes: Cipher = gcmsiv(key, nonce)
  const ciphertext: Uint8Array = aes.encrypt(content)

  return {
    ciphertext: Buffer.from(ciphertext).toString('base64'),
    nonce: Buffer.from(nonce).toString('base64'),
  }
}

export function decryptKeys(key: Uint8Array, cipthertext: string, nonce: string): ChatKeys[] | null {
  const aes: Cipher = gcmsiv(key, Uint8Array.from(Buffer.from(nonce, 'base64')))
  const ciphertext: Uint8Array = aes.decrypt(Uint8Array.from(Buffer.from(cipthertext, 'base64')))
  const decrypted: string = new TextDecoder().decode(ciphertext)

  try {
    return JSON.parse(decrypted)
  } catch {
    return null
  }
}
