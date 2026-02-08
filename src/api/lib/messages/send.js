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

        encapsulated_key: payload.encapsulated_key,
        cek_wrap: payload.cek_wrap,
        cek_wrap_iv: payload.cek_wrap_iv,
        cek_wrap_salt: payload.cek_wrap_salt,

        encapsulated_key_sender: payload.encapsulated_key_sender,
        cek_wrap_sender: payload.cek_wrap_sender,
        cek_wrap_sender_iv: payload.cek_wrap_sender_iv,
        cek_wrap_sender_salt: payload.cek_wrap_sender_salt,

        signed_payload: payload.signed_payload,
        signature: payload.signature,
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
