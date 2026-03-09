import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'
import axios from 'axios'

export default async function (keys) {
  try {
    // mmkv storage
    const Storage = await createSecureStorage('user-storage')

    // get current user token from mmkv storage
    const token = Storage.getString('token')

    const response = await axios.post(
      `${API_URL}/session/add-keys`,
      {
        identity_pub: keys.ed_public_key,
        ecdh_pub: keys.ecdh_public_key,
        kyber_pub: keys.kyber_public_key,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data
  } catch {}
}
