import getChatFromStorage from '../../lib/getChatFromStorage'
import encrypt from '../../lib/skid/encrypt'
import { encrypt as sskEncrypt } from '../../lib/skid/serversideKeyEncryption'
import { createSecureStorage } from '../../lib/storage'

export default async function (content, chat_id, count) {
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

    return encrypted
  } catch (err) {
    console.log(err)
  }
}
