import formatSentTime from '@lib/formatSentTime'
import { Q } from '@nozbe/watermelondb'
import { database } from 'src/db'

export default async function (mmkv, chat_id) {
  const collection = database.get('messages')
  const messagesArray = await collection.query(Q.where('chat_id', chat_id), Q.sortBy('server_id', Q.desc)).fetch()
  // get all chat messages
  const messages = messagesArray.slice(0, 20)
  // user id
  const userId = parseInt(mmkv.getString('user_id'), 10)
  // add isMe param to message object
  return messages.map((message) => ({
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
}
