import { API_URL } from '@constants/api'
import getSkid from '@constants/skid'
import getChatFromStorage from '@lib/getChatFromStorage'
import { restoreBytes } from '@lib/skid-v3/src/utils'
import { createSecureStorage } from '@lib/storage'
import axios from 'axios'
import prepareForHanshake from '../handshake/prepare'
import getMySession from '../sessions/getMySession'

export default async function getChats() {
  try {
    const skid = await getSkid()

    // mmkv storage
    const storage = await createSecureStorage('user-storage')

    // get user token from mmkv storage
    const token = storage.getString('token')

    // send get chats api request
    const response = await axios.get(`${API_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const session = await getMySession()

    // parse chats from mmkv storage
    let chats: any
    try {
      chats = JSON.parse(storage.getString('chats'))
    } catch {
      chats = []
    }

    // response chats map
    await Promise.all(
      response?.data?.map(async (chat) => {
        // get chat from mmkv storage
        const chatInStorage = await getChatFromStorage(chat?.id)

        const members = [...(chat?.members || [])].map((member) => {
          const { kyber_public_key, ecdh_public_key, ed_public_key, ...user } = member
          return user
        })

        const me = members.find((member) => member?.id === session?.user_id)
        const recipient = members.find((member) => member?.id !== me?.id)

        // if chat exists in mmkv storage
        if (chat) {
          // find chat index
          const chatIndex = chats?.findIndex((_chat) => _chat?.id === chat?.id)
          if (chatIndex !== -1) {
            // add or change chat keys and data in mmkv storage
            // PS: if recipient keys changed in api they will be changed in mmkv storage too because this code
            chats[chatIndex] = {
              id: chat?.id,
              key: chatInStorage?.key,
              members,
              me,
              recipient,
            }
          } else {
            const recipient = chat?.members?.find((member) => member?.id !== session?.user_id)

            const { sender_keys, recipient_keys } = await prepareForHanshake(storage, recipient)

            let chat_key: Buffer
            const flag = false

            try {
              // isSender: false
              chat_key = await skid.handshake.finalize(restoreBytes(chat?.handshake), recipient_keys, sender_keys, flag)
            } catch {
              try {
                // isSender: true
                chat_key = await skid.handshake.finalize(restoreBytes(chat?.handshake), sender_keys, recipient_keys, !flag)
              } catch {
                chat_key = null
              }
            }

            // IF CHAT IS NOT EXISTS IN MMKV STORAGE
            // add chat to storage
            chats.push({
              id: chat?.id,
              key: Buffer.from(chat_key).toString('hex'),
              members,
              me,
              recipient,
            })
          }
        }
      }),
    )

    // set new chats
    storage.set('chats', JSON.stringify(chats))

    // return api response
    return chats
  } catch (error) {
    console.log(error)
  }
}
