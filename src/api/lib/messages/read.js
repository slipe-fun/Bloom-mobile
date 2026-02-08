import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'

export default async function readMessagesRequest(chat_id, messages) {
  try {
    const Storage = await createSecureStorage('user-storage')
    const token = Storage.getString('token')

    const response = await fetch(`${API_URL}/message/seen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chat_id,
        messages,
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
