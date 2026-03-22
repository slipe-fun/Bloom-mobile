import decryptMessages from '@api/lib/messages/decryptMessages'
import { getChatMessagesBeforeID } from '@api/lib/messages/getChatMessages'
import mergeAndSort from '@api/lib/utils/mergeAndSort'
import formatSentTime from '@lib/formatSentTime'
import { Q } from '@nozbe/watermelondb'
import { database } from 'src/db'

export default async function (mmkv, chat_id, messages, setMessages) {
  const lastMessage = messages[0]

  if (!lastMessage || !lastMessage?.id) return

  const collection = database.get('messages')
  const nextMessagesArray = await collection
    .query(Q.and(Q.where('server_id', Q.lt(lastMessage?.id ?? 0)), Q.where('chat_id', chat_id)), Q.sortBy('server_id', Q.desc))
    .fetch()

  const nextMessages = nextMessagesArray.slice(0, 20) ?? null

  if (!nextMessages || nextMessages.length < 1) {
    const messages = await getChatMessagesBeforeID(chat_id, lastMessage?.id || 0)

    const decrypted_messages = await decryptMessages(mmkv, chat_id, messages)

    if (!decrypted_messages) return

    setMessages((prev) => mergeAndSort(prev, decrypted_messages))
  } else {
    const userId = parseInt(mmkv.getString('user_id'), 10)

    const mutatedMessages = nextMessages.map((message) => ({
      id: message.serverId,
      chatId: message.chatId,
      content: message.content,
      authorId: message.authorId,
      date: message.date,
      formatted_date: formatSentTime(message?.date),
      seen: message.seen,
      nonce: message.nonce,
      isMe: message.authorId === userId,
    }))

    setMessages((prev) => mergeAndSort(prev, mutatedMessages))
  }
}
