import { getSKID } from '@lib/skid/lazySkid'
import getChatFromStorage from '../../lib/getChatFromStorage'
import { createSecureStorage } from '../../lib/storage'

export default async function (content, chat_id) {
  try {
    const skid = await getSKID()
    // mmkv storage
    const storage = await createSecureStorage('user-storage')
    // get chat from mmkv storage
    const chatData = await getChatFromStorage(chat_id)

    const user_id = parseInt(storage.getString('user_id'), 10)

    try {
      return skid.aes.encrypt(content, user_id, chatData?.key)
    } catch {
      return
    }
  } catch (err) {
    console.log(err)
  }
}
