import { createSecureStorage } from '@lib/storage'
import getMyUser from '../users/getMyUser'

export default async function (chat) {
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

  const user = await getMyUser()

  // add chat to mmkv storage
  chats = [
    ...chats,
    {
      id: chat?.id,
      members: chat?.members?.map((member) => ({ ...member, isMe: member?.id === user?.id })),
      key: null,
    },
  ]

  // save changes
  Storage.set('chats', JSON.stringify(chats))

  return chats
}
