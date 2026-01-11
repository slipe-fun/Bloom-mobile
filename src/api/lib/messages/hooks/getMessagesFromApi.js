import mergeAndSort from '@api/lib/utils/mergeAndSort'
import decryptMessages from '../decryptMessages'
import { getChatMessagesAfterID } from '../getChatMessages'

export default async function (realm, mmkv, setMessages, chat_id) {
  // last saved message
  const lastMessage = realm.objects('Message').filtered('chat_id == $0', chat_id).sorted('id', true)[0] ?? null

  // get messages from api sent after last message
  const messages = await getChatMessagesAfterID(chat_id, lastMessage?.id || 0)

  // decrypt messages from api
  const decrypted_messages = await decryptMessages(realm, mmkv, chat_id, messages)

  if (!decrypted_messages) return

  setMessages((prev) => mergeAndSort(prev, decrypted_messages))
}
