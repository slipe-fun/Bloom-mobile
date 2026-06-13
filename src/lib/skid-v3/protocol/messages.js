import { buildAAD } from '../src/aad.js'
import { decrypt, encrypt } from '../src/aes.js'
import { hkdfExpand } from '../src/hkdf.js'
import { generateNonce } from '../src/keys.js'

export async function encryptMessage(key, content, sender_id, receiver_id) {
  // const salt = generateSalt()
  const nonce = generateNonce()

  const sortedIds = [sender_id, receiver_id].sort()
  const id1 = sortedIds[0]
  const id2 = sortedIds[1]

  const derivedKey = await hkdfExpand(key, nonce, new TextEncoder().encode(`skid:v3:message:${id1}:${id2}`), 32)
  const aad = buildAAD('message', { nonce, sender_id: id1, receiver_id: id2 })

  const resultContent = new TextEncoder().encode(
    JSON.stringify({
      content,
      author_id: sender_id,
      date: new Date().toString(),
    }),
  )

  const encrypted = encrypt(derivedKey, resultContent, nonce, aad)

  return {
    ...encrypted,
    // salt,
  }
}

export async function decryptMessage(key, message, sender_id, receiver_id) {
  const sortedIds = [sender_id, receiver_id].sort()
  const id1 = sortedIds[0]
  const id2 = sortedIds[1]

  const derivedKey = await hkdfExpand(key, message?.nonce, new TextEncoder().encode(`skid:v3:message:${id1}:${id2}`), 32)
  const aad = buildAAD('message', { nonce: message?.nonce, sender_id: id1, receiver_id: id2 })

  const decrypted = decrypt(derivedKey, message?.ciphertext, message?.nonce, aad)

  try {
    return JSON.parse(new TextDecoder().decode(decrypted))
  } catch {
    return null
  }
}
