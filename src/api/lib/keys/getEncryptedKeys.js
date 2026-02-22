import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'
import axios from 'axios'

export default async function () {
  try {
    // mmkv storage
    const Storage = await createSecureStorage('user-storage')

    // get current user token from mmkv storage
    const token = Storage.getString('token')

    const response = await axios.get(`${API_URL}/chats/encryption-keys`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data
  } catch {}
}
