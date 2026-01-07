import { Buffer } from '@craftzdog/react-native-buffer'
import { gcmsiv } from '@noble/ciphers/aes.js'
import { type Cipher, randomBytes } from '@noble/ciphers/utils.js'
import generatePadding from './modules/crypto/utils/generatePadding'
import type { Message } from './types/message'

interface Encrypted {
  ciphertext: string
  nonce: string
}

export function encrypt(content: string, user_id: number, key: string): Encrypted {
  const nonce: Uint8Array = randomBytes(12)

  const aes: Cipher = gcmsiv(Uint8Array.from(Buffer.from(key, 'base64')), nonce)

  const ciphertext: Uint8Array = aes.encrypt(
    new TextEncoder().encode(
      JSON.stringify({
        content,
        from_id: user_id,
        date: new Date(),
        padding: generatePadding(),
      }),
    ),
  )

  return {
    ciphertext: Buffer.from(ciphertext).toString('base64'),
    nonce: Buffer.from(nonce).toString('base64'),
  }
}

export function decrypt(encrypted: string, nonce: string, key: string): Message {
  const aes: Cipher = gcmsiv(Uint8Array.from(Buffer.from(key, 'base64')), Uint8Array.from(Buffer.from(nonce, 'base64')))
  const ciphertext: Uint8Array = aes.decrypt(Uint8Array.from(Buffer.from(encrypted, 'base64')))

  return JSON.parse(new TextDecoder().decode(ciphertext))
}
