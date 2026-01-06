import { API_URL } from '@constants/api'
import { encryptKeys } from '@lib/skid/encryptKeys'
import axios from 'axios'
import getKeys from './getKeys'

export default async function (mmkv, keys) {
  try {
    const dump = getKeys(mmkv)

    let newDump = dump
    const existantChat = dump.find((_keys) => _keys.chat_id === keys.chat_id)
    if (existantChat) {
      if (['edPublicKey', 'ecdhPublicKey', 'kyberPublicKey'].every((key) => existantChat[key] === keys[key])) return

      const existantChatIndex = dump.indexOf(existantChat)
      newDump[existantChatIndex] = keys
    } else {
      newDump = [...newDump, keys]
    }

    const password = mmkv.getString('password')
    const salt = mmkv.getString('salt')
    const token = mmkv.getString('token')

    const { ciphertext, nonce } = encryptKeys(password, new TextEncoder().encode(JSON.stringify(newDump)))

    return await axios
      .post(
        `${API_URL}/chats/keys/private`,
        { ciphertext, nonce, salt },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => true)
      .catch(() => false)
  } catch {
    return false
  }
}
