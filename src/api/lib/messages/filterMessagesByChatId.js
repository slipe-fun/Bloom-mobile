export default function (mmkv, chat_id, messages) {
  // user id
  const session = JSON.parse(mmkv.getString('session'), 10)

  // filter messages by current chat_id
  return messages
    .filter((m) => m.chat_id === chat_id)
    .map((m) => ({
      ...m,
      me: m.author_id === session?.user_id,
    }))
}
