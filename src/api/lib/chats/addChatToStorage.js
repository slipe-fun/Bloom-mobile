import { createSecureStorage } from '@lib/storage'

export default async function (chat_id) {
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

  // add chat to mmkv storage
  chats = [
    ...chats,
    {
      id: chat_id,
      key: null,
    },
  ]

  // save changes
  Storage.set('chats', JSON.stringify(chats))

  return chats
}
