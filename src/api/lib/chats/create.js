import encryptKey from '@lib/skid/encryptKey'
import { randomBytes } from '@noble/hashes/utils.js'
import sendEncryptedKeys from '../keys/sendEncryptedKeys'
import getMySession from '../sessions/getMySession'
import getUserSessions from '../sessions/getUserSessions'
import addChatToStorage from './addChatToStorage'
import createChatRequest from './createChatRequest'

export default async function createChat(recipient) {
  const mySession = await getMySession()

  const chat = await createChatRequest(recipient)
  if (!chat) return null

  await addChatToStorage(chat?.id)

  const chat_key = randomBytes(32)

  const recipient_sessions = await getUserSessions(recipient)
  if (!recipient_sessions) return

  let keys = []
  for (const session of recipient_sessions) {
    if (session?.identity_pub && session?.ecdh_pub && session?.kyber_pub) {
      const encrypted = encryptKey(chat_key, mySession, {
        kyber_public_key: session?.kyber_pub,
        ecdh_public_key: session?.ecdh_pub,
        edPublicKey: session?.identity_pub,
      })

      keys = [
        ...keys,
        {
          session_id: session?.id,
          encrypted_key: encrypted?.ciphertext,
          encapsulated_key: encrypted.encapsulated_key,
          cek_wrap: encrypted?.cek_wrap,
          cek_wrap_iv: encrypted?.cek_wrap_iv,
          salt: encrypted?.cek_wrap_salt,
          nonce: encrypted?.nonce,
        },
      ]
    }
  }

  if (keys.length > 0) {
    const add_chat_keys = await sendEncryptedKeys(chat?.id, recipient, keys)
    if (!add_chat_keys) return
  }

  return chat
}
