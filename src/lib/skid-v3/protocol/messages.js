import { buildAAD } from '../src/aad.js'
import { decrypt, encrypt } from '../src/aes.js'
import { hkdfExpand } from '../src/hkdf.js'
import { generateNonce, generateSalt } from '../src/keys.js'

export async function encryptMessage(key, content, sender, receiver) {
  const salt = generateSalt()
  const nonce = generateNonce()

  const derivedKey = await hkdfExpand(key, salt, new TextEncoder().encode(`skid:v3:message:${sender?.id}:${receiver?.id}`), 32)

  const aad = buildAAD('message', {
    nonce,
    sender_id: sender?.id,
    receiver_id: receiver?.id,
  })

  const encrypted = encrypt(derivedKey, content, nonce, aad)

  return {
    ...encrypted,
    salt,
  }
}

export async function decryptMessage(key, message, sender, receiver) {
  const aad = buildAAD('message', {
    nonce: message?.nonce,
    sender_id: sender?.id,
    receiver_id: receiver?.id,
  })

  const derivedKey = await hkdfExpand(key, message?.salt, new TextEncoder().encode(`skid:v3:message:${sender?.id}:${receiver?.id}`), 32)

  return decrypt(derivedKey, message?.ciphertext, message?.nonce, aad)
}
