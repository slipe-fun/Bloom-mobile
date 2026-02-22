import { API_URL } from '@constants/api'
import { createSecureStorage } from '@lib/storage'

export default async function (chat_id, recipient, keys) {
  try {
    const Storage = await createSecureStorage('user-storage')
    const token = Storage.getString('token')

    const response = await fetch(`${API_URL}/chat/${chat_id}/member/${recipient}/encryption-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(keys),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (err) {
    console.log(err)
    return null
  }
}
