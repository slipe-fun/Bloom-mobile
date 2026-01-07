import type { Message } from '@lib/skid/types/message'
import { gcmsiv } from '@noble/ciphers/aes.js'
import type { Cipher } from '@noble/ciphers/utils.js'

export default function encryptMessage(aesKey: Uint8Array, iv: Uint8Array, messageObject: Message): Uint8Array {
  const plaintext: Uint8Array = new TextEncoder().encode(JSON.stringify(messageObject))
  const cipher: Cipher = gcmsiv(aesKey, iv)
  return cipher.encrypt(plaintext)
}
