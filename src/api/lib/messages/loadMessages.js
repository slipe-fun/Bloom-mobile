import decryptMessages from '@api/lib/messages/decryptMessages'
import { getChatMessagesBeforeID } from '@api/lib/messages/getChatMessages'
import mergeAndSort from '@api/lib/utils/mergeAndSort'

export default async function (realm, mmkv, chat_id, messages, setMessages) {
  const lastMessage = messages[0]

  if (!lastMessage || !lastMessage?.id) return

  const nextMessages =
    realm.objects('Message').filtered('id < $0 && chat_id == $1', lastMessage?.id, chat_id).sorted('id', true).slice(0, 20) ?? null

  if (!nextMessages || nextMessages.length < 1) {
    const messages = await getChatMessagesBeforeID(chat_id, lastMessage?.id || 0)

    const decrypted_messages = await decryptMessages(realm, mmkv, chat_id, messages)

    if (!decrypted_messages) return

    setMessages((prev) => mergeAndSort(prev, decrypted_messages))
  } else {
    const userId = parseInt(mmkv.getString('user_id'), 10)

    const mutated_messages = nextMessages.map((message) => ({ ...message, isMe: message.author_id === userId }))

    setMessages((prev) => mergeAndSort(prev, mutated_messages))
  }
}
