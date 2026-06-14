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

  const members = [...(chat?.members || [])].map((member) => {
    const { kyber_public_key, ecdh_public_key, ed_public_key, ...user } = member
    return user
  })

  const me = members.find((member) => member?.id === session?.user_id)
  const recipient = members.find((member) => member?.id !== me?.id)

  const storageChat = {
    id: chat?.id,
    me,
    recipient,
    key,
  }

  // add chat to mmkv storage
  chats = [...chats, storageChat]

  // save changes
  Storage.set('chats', JSON.stringify(chats))

  return storageChat
}
