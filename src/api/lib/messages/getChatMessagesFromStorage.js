export default function (realm, mmkv, chat_id) {
  // get all chat messages
  const realmMessages = realm.objects('Message').filtered('chat_id == $0', chat_id).sorted('id', true).slice(0, 20)
  // user id
  const userId = parseInt(mmkv.getString('user_id'), 10)
  // add isMe param to message object
  return realmMessages.map((message) => ({
    ...message,
    isMe: message.author_id === userId,
  }))
}
