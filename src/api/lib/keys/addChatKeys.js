import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'

export default async function addChatKeysRequest(payload) {
  try {
    const Storage = await createSecureStorage('user-storage')
    const token = Storage.getString('token')

    const response = await fetch(`${API_URL}/chat/${payload.chat_id}/keys/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kyber_public_key: payload.kyber_public_key,
        ecdh_public_key: payload.ecdh_public_key,
        ed_public_key: payload.ed_public_key,
      }),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}
