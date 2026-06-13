import { database } from 'src/db'
import { createSecureStorage } from 'src/lib/storage'
import sendMessageRequest from './send'

export default async function (content, chat_id, encrypted, reply_to) {
  // mmkv storage
  const storage = await createSecureStorage('user-storage')
  // get chat from mmkv storage

  const session = JSON.parse(storage.getString('session'), 10)

  // send encrypted message socket
  const response = await sendMessageRequest({
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
        m.authorId = session?.user_id
        m.date = new Date()
        m.seen = null
        m.nonce = response?.nonce
        m.replyToId = reply_to
      })
    })

    return response
  }
}
