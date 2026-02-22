import { API_URL } from '@constants/api'
import getChatFromStorage from '@lib/getChatFromStorage'
import { createSecureStorage } from '@lib/storage'
import axios from 'axios'
import addKeysToDump from '../keys/addKeysToDump.js'

export default async function getChats(ws) {
  try {
    // mmkv storage
    const Storage = await createSecureStorage('user-storage')

    // get user token from mmkv storage
    const token = Storage.getString('token')

    // send get chats api request
    const response = await axios.get(`${API_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // parse chats from mmkv storage
    let chats
    try {
      chats = JSON.parse(Storage.getString('chats'))
    } catch {
      chats = []
    }

    // response chats map
    await Promise.all(
      response?.data?.map(async (chat) => {
        // get chat from mmkv storage
        const chatInStorage = await getChatFromStorage(chat?.id)

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
              members: [...(chat?.members || [])],
            }

            // send dump
            addKeysToDump(Storage, chats[chatIndex])
          }
        } else {
          // IF CHAT IS NOT EXISTS IN MMKV STORAGE
          // add chat to storage
          chats.push({
            id: chat?.id,
            key: null,
            members: [...(chat?.members || [])],
          })
        }
      }),
    )

    // set new chats
    Storage.set('chats', JSON.stringify(chats))

    // return api response
    return response.data
  } catch (error) {
    console.log(error)
  }
}
