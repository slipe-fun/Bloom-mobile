import { Buffer } from '@craftzdog/react-native-buffer'
import encryptKey from '@lib/skid/encryptKey'
import { createSecureStorage } from '@lib/storage'
import { randomBytes } from '@noble/hashes/utils.js'
import addKeysToDump from '../keys/addKeysToDump'
import changeChatKey from '../keys/changeChatKey'
import sendEncryptedKeys from '../keys/sendEncryptedKeys'
import getMySession from '../sessions/getMySession'
import getMySessions from '../sessions/getMySessions'
import getUserSessions from '../sessions/getUserSessions'
import getMyUser from '../users/getMyUser'
import addChatToStorage from './addChatToStorage'
import createChatRequest from './createChatRequest'

function encryptKeys(sessions, chat_key, mySession) {
  let keys = []
  for (const session of sessions) {
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

  return keys
}

export default async function createChat(recipient) {
  const storage = await createSecureStorage('user-storage')

  const mySession = await getMySession()
  const myUser = await getMyUser()

  const chat = await createChatRequest(recipient)
  if (!chat) return null

  await addChatToStorage(chat)

  const chat_key = randomBytes(32)

  await changeChatKey(chat?.id, Buffer.from(chat_key).toString('base64'))

  const recipient_sessions = await getUserSessions(recipient)
  if (!recipient_sessions) return

  const keys = encryptKeys(recipient_sessions, chat_key, mySession)

  if (keys.length > 0) {
    const add_chat_keys = await sendEncryptedKeys(chat?.id, recipient, keys)
    if (!add_chat_keys) return
  }

  const my_sessions = await getMySessions()
  if (!my_sessions) return

  const my_keys = encryptKeys(my_sessions?.filter((session) => session?.id !== mySession?.id).filter(Boolean), chat_key, mySession)

  if (my_keys.length > 0) {
    const add_chat_keys = await sendEncryptedKeys(chat?.id, myUser?.id, my_keys)
    if (!add_chat_keys) return
  }

  await addKeysToDump(storage, { id: chat?.id, key: Buffer.from(chat_key).toString('base64') })

  return chat
}
