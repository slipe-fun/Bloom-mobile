import { gcmsiv } from '@noble/ciphers/aes.js'
import type { Cipher } from '@noble/ciphers/utils.js'

export default function decryptCekWithKek(kek: Uint8Array, iv: Uint8Array, wrappedCek: Uint8Array): Uint8Array {
  const cipher: Cipher = gcmsiv(kek, iv)
  return cipher.decrypt(wrappedCek)
}
