import addKeysToDump from '@api/lib/keys/addKeysToDump'
import generateKeys from '@lib/skid/generateKeys'
import { createSecureStorage } from '@lib/storage'

export default async function (chat_id, encryption_key) {
  // mmkv storage
  const Storage = await createSecureStorage('user-storage')

  // chat created socket
  // parse chats from mmkv storage
  let chats
  try {
    chats = JSON.parse(Storage.getString('chats'))
  } catch {
    chats = []
  }

  // generate current user encryption keys
  const myKeys = generateKeys()

  // send current user public keys
  //   ws.send(
  //     JSON.stringify({
  //       type: 'add_keys',
  //       chat_id: chat_id,
  //       kyber_public_key: myKeys.kyber_public_key,
  //       ecdh_public_key: myKeys.ecdh_public_key,
  //       ed_public_key: myKeys.ed_public_key,
  //     }),
  //   )

  // add chat to mmkv storage
  chats = [
    ...chats,
    {
      id: chat_id,
      key: encryption_key,
      keys: {
        my: { ...myKeys },
        recipient: {},
      },
    },
  ]

  // send dump
  addKeysToDump(Storage, { chat_id: chat_id, ...myKeys })

  // save changes
  Storage.set('chats', JSON.stringify(chats))

  return chats
}
