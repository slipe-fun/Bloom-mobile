import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'

export default async function createChatRequest(recipient) {
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
      }),
    })

    if (!response.ok) {
      console.log(response)
      return null
    }

    return await response.json()
  } catch (err) {
    console.log(err)
    return null
  }
}
