import getChatFromStorage from '../../lib/getChatFromStorage'
import { encrypt as sskEncrypt } from '../../lib/skid/serversideKeyEncryption'
import { createSecureStorage } from '../../lib/storage'

export default async function (content, chat_id, count) {
  try {
    // mmkv storage
    const storage = await createSecureStorage('user-storage')
    // get chat from mmkv storage
    const chatData = await getChatFromStorage(chat_id)

    const user_id = parseInt(storage.getString('user_id'), 10)

    try {
      return sskEncrypt(content, user_id, chatData?.key)
    } catch {
      return
    }
  } catch (err) {
    console.log(err)
  }
}
