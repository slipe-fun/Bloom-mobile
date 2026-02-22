// format
// [{ chat_id, kyber_secret_key, ecdh_secret_key, ed_secret_key }, ...]

export default function (mmkv) {
  let chats
  try {
    chats = JSON.parse(mmkv.getString('chats'))
  } catch {
    chats = []
  }

  return chats.map((chat) => {
    return {
      chat_id: chat?.id,
      key: chat?.key,
    }
  })
}
