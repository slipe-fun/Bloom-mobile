export default function (mmkv) {
  let chats
  try {
    chats = JSON.parse(mmkv.getString('chats'))
  } catch {
    chats = []
  }

  return chats?.map((chat) => {
    return {
      id: chat?.id,
      key: chat?.key,
      members: chat?.members,
    }
  })
}
