import getSkid from '@constants/skid'
import getChatFromStorage from './chats/getChatFromStorage'

export default async function (content: string, chat_id: number, key: string) {
  try {
    const skid = await getSkid()

    const chat = await getChatFromStorage(chat_id)

    try {
      return skid.message.encrypt(Buffer.from(key, 'hex'), content, chat?.me?.id, chat?.recipient?.id)
    } catch (error) {
      console.log(error)
    }
  } catch (err) {
    console.log(err)
  }
}
