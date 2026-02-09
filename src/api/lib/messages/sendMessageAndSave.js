import { database } from 'src/db'
import getChatFromStorage from 'src/lib/getChatFromStorage'
import { createSecureStorage } from 'src/lib/storage'
import sendMessageRequest from './send'

export default async function (content, chat_id, encrypted, reply_to) {
  // mmkv storage
  const storage = await createSecureStorage('user-storage')
  // get chat from mmkv storage
  const chatData = await getChatFromStorage(chat_id)

  const user_id = parseInt(storage.getString('user_id'), 10)

  // send encrypted message socket
  const response = await sendMessageRequest({
    encryption_type: !chatData?.keys?.recipient?.kyber_public_key ? 'server' : 'client',
    chat_id: chat_id,
    reply_to,
    ...encrypted,
  })

  if (response) {
    // write decrypted messages to local storage
    await database.write(async () => {
      const collection = database.get('messages')

      await collection.create((m) => {
        m.serverId = response?.id
        m.chatId = chat_id
        m.content = content
        m.authorId = user_id
        m.date = new Date()
        m.seen = null
        m.nonce = response?.nonce
        m.replyToId = reply_to
      })
    })

    return response
  }
}
