import encryptMessage from '@api/lib/encryptMessage'
import mergeAndSort from '@api/lib/utils/mergeAndSort'
import getReplyToMessageFromStorage from '../getReplyToMessageFromStorage'
import sendMessageAndSave from '../sendMessageAndSave'

export default async function (mmkv, ws, content, reply_to, messages, setMessages, chat_id) {
  try {
    // send message socket
    const message = await encryptMessage(content, chat_id, messages?.length)
    if (!message) return

    let _reply_to
    if (reply_to) {
      try {
        const reply_to_message = getReplyToMessageFromStorage(reply_to)

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
      isSending: true,
      nonce: message?.nonce,
      chat_id,
      content,
      author_id: parseInt(mmkv?.getString('user_id'), 10),
      date: new Date(),
      seen: false,
      reply_to: reply_to_json,
    }

    setMessages((prev) => mergeAndSort(prev, [newMsg]))

    const response = await sendMessageAndSave(content, chat_id, message, reply_to)
    if (!response) return

    setMessages((prev) =>
      mergeAndSort(prev, [
        {
          ...newMsg,
          id: response?.id,
          isSending: false,
        },
      ]),
    )
    console.log('saved')
  } catch (err) {
    console.log(err)
  }
}
