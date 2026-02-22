import getChatFromStorage from '@lib/getChatFromStorage'
import { decrypt as sskDecrypt } from '@lib/skid/serversideKeyEncryption'
import { Q } from '@nozbe/watermelondb'
import { database } from 'src/db'
import getReplyToMessageFromStorage from './getReplyToMessageFromStorage'

export default async function (mmkv, chat_id, messages) {
  if (!messages) return

  // is chat in storage check
  const chat = await getChatFromStorage(chat_id)
  if (!chat) return

  const key = chat?.key

  // user id
  const userId = parseInt(mmkv.getString('user_id'), 10)

  const decryptedMessages = messages
    .map((message) => {
      let reply_to
      if (message?.reply_to) {
        try {
          const reply_to_message = getReplyToMessageFromStorage(message?.reply_to?.id)

          if (reply_to_message) {
            reply_to = reply_to_message
          } else {
            reply_to = sskDecrypt(message?.reply_to?.ciphertext, message?.reply_to?.nonce, key)
          }
        } catch {}
      }

      try {
        // if kyber message sent by recipient then decrypt using both key pairs
        // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
        return {
          ...sskDecrypt(message?.ciphertext, message?.nonce, chat?.key),
          chat_id: message?.chat_id,
          id: message?.id,
          seen: message?.seen,
          nonce: message?.nonce,
          reply_to: reply_to
            ? {
                id: message?.reply_to?.id,
                chat_id: message?.chat_id,
                content: reply_to?.content,
                author_id: reply_to?.author_id || reply_to?.from_id,
                date: reply_to?.date,
                seen: message?.reply_to?.seen,
              }
            : null,
        }
      } catch {}

      return null
    })
    .filter(Boolean)
    .map((message) => ({
      ...message,
      isMe: message?.from_id === userId,
    }))

  // write decrypted messages to local storage
  await database.write(async () => {
    const collection = database.get('messages')

    for (const message of decryptedMessages) {
      const existing = await collection.query(Q.where('server_id', message?.id)).fetch()

      if (existing[0]) {
        await existing[0].update((m) => {
          m.chatId = message.chat_id
          m.content = message.content
          m.authorId = message.from_id
          m.date = new Date(message.date)
          m.nonce = message.nonce
          m.replyToId = message?.reply_to?.id
        })
      } else {
        await collection.create((m) => {
          m.serverId = message?.id
          m.chatId = message.chat_id
          m.content = message.content
          m.authorId = message.from_id
          m.date = new Date(message.date)
          m.seen = null
          m.nonce = message.nonce
          m.replyToId = message?.reply_to?.id
        })
      }
    }
  })

  return decryptedMessages
}
