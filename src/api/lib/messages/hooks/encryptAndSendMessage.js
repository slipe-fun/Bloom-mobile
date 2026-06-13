import encryptMessage from '@api/lib/encryptMessage'
import mergeAndSort from '@api/lib/utils/mergeAndSort'
import formatSentTime from '@lib/formatSentTime'
import { bytesToBase64 } from '@lib/skid-v3/src/utils'
import getReplyToMessageFromStorage from '../getReplyToMessageFromStorage'
import sendMessageAndSave from '../sendMessageAndSave'

export default async function (mmkv, ws, content, reply_to, messages, setMessages, chat_id, author_id, key) {
  try {
    // send message socket
    const encrypted = await encryptMessage(content, chat_id, key)
    if (!encrypted) return

    const message = bytesToBase64(encrypted)

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
          author_id: _reply_to?.author_id,
          date: _reply_to?.date,
          seen: _reply_to?.seen,
        }
      : null

    const lastId = messages?.length > 0 ? messages[messages.length - 1].id : 0

    // payload
    const newMsg = {
      id: lastId + 1,
      me: true,
      isSending: true,
      nonce: message?.nonce,
      chatId: chat_id,
      content,
      authorId: author_id,
      raw_date: new Date(),
      date: formatSentTime(new Date().toString()),
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
  } catch (err) {
    console.log(err)
  }
}
