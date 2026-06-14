import getSkid from '@constants/skid'
import type { User } from '@interfaces'
import { bytesToBase64 } from '@lib/skid-v3/src/utils'
import { createSecureStorage } from '@lib/storage'
import prepareForHanshake from '../handshake/prepare'
import addChatToStorage from './addChatToStorage'
import createChatRequest from './createChatRequest'

export default async function createChat(recipient: User) {
  const skid = await getSkid()

  const storage = await createSecureStorage('user-storage')

  const { sender_keys, recipient_keys } = await prepareForHanshake(storage, recipient)

  const handshake = await skid.handshake.initiate(sender_keys, recipient_keys)

  const chat_key = handshake?.chat_key
  const handshake_payload = bytesToBase64(handshake?.payload)

  const chat = await createChatRequest(recipient?.id, handshake_payload)
  if (!chat) return

  return await addChatToStorage(chat, Buffer.from(chat_key).toString('hex'))
}
