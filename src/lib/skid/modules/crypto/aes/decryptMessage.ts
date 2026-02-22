import type { Message } from '@lib/skid/types/message'
import { gcmsiv } from '@noble/ciphers/aes.js'
import type { Cipher } from '@noble/ciphers/utils.js'

export function decryptMessage(cekRaw: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array): Message | string {
  const cipher: Cipher = gcmsiv(cekRaw, iv)
  const plain: Uint8Array = cipher.decrypt(ciphertext)
  const decoded: string = new TextDecoder().decode(plain)
  try {
    return JSON.parse(decoded)
  } catch {
    return decoded
  }
}

export function decryptKey(cekRaw, iv, ciphertext) {
  const cipher = gcmsiv(cekRaw, iv)
  const plain = cipher.decrypt(ciphertext)
  return plain
}
