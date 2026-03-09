import mergeAndSort from '@api/lib/utils/mergeAndSort'
import { Q } from '@nozbe/watermelondb'
import { database } from 'src/db'
import decryptMessages from '../decryptMessages'
import { getChatMessagesAfterID } from '../getChatMessages'

export default async function (mmkv, setMessages, chat_id) {
  const collection = await database.get('messages')
  const lastMessages = await collection.query(Q.where('chat_id', chat_id), Q.sortBy('server_id', Q.desc)).fetch()
  // last saved message
  const lastMessage = lastMessages[0]

  // get messages from api sent after last message
  const messages = await getChatMessagesAfterID(chat_id, lastMessage?._raw?.server_id || 0)

  // decrypt messages from api
  const decrypted_messages = await decryptMessages(mmkv, chat_id, messages)

  if (!decrypted_messages) return

  setMessages((prev) => mergeAndSort(prev, decrypted_messages))
}
