import { API_URL } from '@constants/api'
import { getSKID } from '@lib/skid/lazySkid'
import base64ToUint8Array from '@lib/skid/modules/utils/base64ToUint8Array'
import axios from 'axios'
import getKeys from './getKeys'

export default async function (mmkv, keys) {
  try {
    const skid = await getSKID()

    const dump = getKeys(mmkv)

    let newDump = dump
    const existantChat = dump.find((_keys) => _keys.id === keys.id)
    if (existantChat) {
      const existantChatIndex = dump.indexOf(existantChat)
      newDump[existantChatIndex] = keys
    } else {
      newDump = [...newDump, keys]
    }

    const password = mmkv.getString('password')
    const salt = mmkv.getString('salt')
    const token = mmkv.getString('token')

    const { ciphertext, nonce } = skid.server.encryptKeys(
      base64ToUint8Array(password),
      new TextEncoder().encode(JSON.stringify(newDump.map((chat) => ({ id: chat?.id, key: chat?.key })))),
    )

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
