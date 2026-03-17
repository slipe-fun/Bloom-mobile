import { API_URL } from '@constants/api'
import { getSKID } from '@lib/skid/lazySkid'
import base64ToUint8Array from '@lib/skid/modules/utils/base64ToUint8Array'
import axios from 'axios'
import getKeys from './getKeys'

export default async function (mmkv, keys) {
  try {
    const skid = await getSKID()

    const dump = getKeys(mmkv) || []

    const keysArray = Array.isArray(keys) ? keys : [keys]

    const newDump = [...dump]

    for (const keyItem of keysArray) {
      if (!keyItem?.id) continue

      const index = newDump.findIndex((k) => k.id === keyItem.id)

      if (index !== -1) {
        newDump[index] = {
          ...newDump[index],
          ...keyItem,
        }
      } else {
        newDump.push(keyItem)
      }
    }

    const password = mmkv.getString('password')
    const salt = mmkv.getString('salt')
    const token = mmkv.getString('token')

    if (!password || !salt || !token) return false

    const payload = newDump
      .filter((chat) => chat?.id && chat?.key)
      .map((chat) => ({
        id: chat.id,
        key: chat.key,
      }))

    const { ciphertext, nonce } = skid.server.encryptKeys(base64ToUint8Array(password), new TextEncoder().encode(JSON.stringify(payload)))

    await axios.post(
      `${API_URL}/chats/keys/private`,
      { ciphertext, nonce, salt },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return true
  } catch {
    return false
  }
}
