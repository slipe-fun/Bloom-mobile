import sendMessage from '@api/lib/sendMessage'
import mergeAndSort from '@api/lib/utils/mergeAndSort'
import getReplyToMessageFromStorage from '../getReplyToMessageFromStorage'

export default async function (realm, mmkv, ws, content, reply_to, messages, setMessages, chat_id) {
  try {
    // send message socket
    const nonce = await sendMessage(content, reply_to, chat_id, messages?.length, ws)

    let _reply_to
    if (reply_to) {
      try {
        const reply_to_message = getReplyToMessageFromStorage(realm, reply_to)

        if (reply_to_message) {
          _reply_to = reply_to_message
        }
      } catch {}
    }

    const reply_to_json = reply_to
      ? {
          id: _reply_to?.id,
          chat_id,
          content: _reply_to?.content,
          author_id: _reply_to?.author_id || _reply_to?.from_id,
          date: _reply_to?.date,
          seen: _reply_to?.seen,
        }
      : null

    const lastId = messages?.length > 0 ? messages[messages.length - 1].id : 0

    // payload
    const newMsg = {
      id: lastId + 1,
      isMe: true,
      isFake: true,
      nonce,
      chat_id,
      content,
      author_id: parseInt(mmkv?.getString('user_id'), 10),
      date: new Date(),
      seen: false,
      reply_to: reply_to_json,
    }

    setMessages((prev) => mergeAndSort(prev, [newMsg]))
  } catch {}
}
