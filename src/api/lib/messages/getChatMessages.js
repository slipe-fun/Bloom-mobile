import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'
import axios from 'axios'

export default async function (chat_id, after_id = 0) {
  try {
    // mmkv storage
    const Storage = await createSecureStorage('user-storage')

    // get current user token from mmkv storage
    const token = Storage.getString('token')

    // send get messages api request
    const response = await axios.get(`${API_URL}/chat/${chat_id}/messages/after/${after_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data
  } catch {}
}
