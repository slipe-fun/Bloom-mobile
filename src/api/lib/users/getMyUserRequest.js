import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'
import axios from 'axios'

export default async function () {
  // mmkv storage
  const Storage = await createSecureStorage('user-storage')
  // get user token from mmkv storage
  const token = Storage.getString('token')

  // send get user info request
  const response = await axios.get(`${API_URL}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response?.data
}
