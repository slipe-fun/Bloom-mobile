import { createSecureStorage } from '@lib/storage'
import getMySession from '../sessions/getMySession'

export default async function (chat, key) {
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

  const session = await getMySession()

  // add chat to mmkv storage
  chats = [
    ...chats,
    {
      id: chat?.id,
      members: chat?.members?.map((member) => ({ ...member, isMe: member?.id === session?.user_id })),
      key,
    },
  ]

  // save changes
  Storage.set('chats', JSON.stringify(chats))

  return chats
}
