export default function (mmkv, chat_id, new_key) {
  let chats
  try {
    chats = JSON.parse(mmkv.getString('chats'))
  } catch {
    chats = []
  }

  chats = chats.map((chat) => {
    return {
      chat_id: chat?.id,
      key: chat?.id === chat_id ? new_key : chat?.key,
    }
  })

  // set new chats
  mmkv.set('chats', JSON.stringify(chats))

  return chats
}
