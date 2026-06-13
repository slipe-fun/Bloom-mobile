import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'

export default async function sendMessageRequest(payload) {
  try {
    const Storage = await createSecureStorage('user-storage')
    const token = Storage.getString('token')

    const response = await fetch(`${API_URL}/message/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: payload.encryption_type,
        chat_id: payload.chat_id,
        reply_to: payload.reply_to ?? null,
        ciphertext: payload.ciphertext,
        nonce: payload.nonce,
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
