import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'

export default async function createChatRequest(recipient, handshake) {
  try {
    const Storage = await createSecureStorage('user-storage')
    const token = Storage.getString('token')

    const response = await fetch(`${API_URL}/chat/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipient,
        handshake,
      }),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (err) {
    console.error(err)
    return null
  }
}
