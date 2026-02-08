import { database } from 'src/db'
import getChatFromStorage from '../../lib/getChatFromStorage'
import encrypt from '../../lib/skid/encrypt'
import { encrypt as sskEncrypt } from '../../lib/skid/serversideKeyEncryption'
import { createSecureStorage } from '../../lib/storage'
import sendMessageRequest from '../lib/messages/send'

export default async function (content, reply_to, chat_id, count, ws) {
  try {
    // mmkv storage
    const storage = await createSecureStorage('user-storage')
    // get chat from mmkv storage
    const chatData = await getChatFromStorage(chat_id)

    const user_id = parseInt(storage.getString('user_id'), 10)

    let encrypted

    // if recipient dont assigned keys use skid soft mode
    if (!chatData?.keys?.recipient?.kyber_public_key) {
      try {
        // skid soft mode (or serversidekey = ssk) encryption
        // need message content, current user id, chat key
        encrypted = sskEncrypt(content, user_id, chatData?.key)
      } catch {
        return
      }
    }
    // IF HEAVY SKID ENCRYPTION TYPE
    // encrypt message
    else {
      encrypted = encrypt(content, { ...chatData?.keys?.my, id: user_id }, chatData?.keys?.recipient, count)
    }

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

      return response?.nonce
    }
  } catch (err) {
    console.log(err)
  }
}
