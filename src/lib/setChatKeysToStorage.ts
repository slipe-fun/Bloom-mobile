import { createSecureStorage } from '@lib/storage'

export default async function (chat_id: number, keys: any) {
  const Storage = await createSecureStorage('user-storage')

  let chats: Array<any>
  try {
    const chatsString = Storage.getString('chats')
    chats = JSON.parse(chatsString || '[]')
  } catch {
    return null
  }

  const chat = chats?.find((chat) => chat?.id === chat_id)

  chats = [
    ...(chats?.filter((_chat) => _chat?.id !== chat_id) ?? []),
    {
      ...chat,
      keys: {
        my: { ...chat?.keys?.my },
        recipient: { ...keys },
      },
    },
  ]

  Storage.set('chats', JSON.stringify(chats))

  return chats
}
