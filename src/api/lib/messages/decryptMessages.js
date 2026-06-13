import getSkid from '@constants/skid'
import formatSentTime from '@lib/formatSentTime'
import { restoreBytes } from '@lib/skid-v3/src/utils'
import { Q } from '@nozbe/watermelondb'
import { database } from 'src/db'
import getChatFromStorage from '../chats/getChatFromStorage'
import getReplyToMessageFromStorage from './getReplyToMessageFromStorage'

export default async function (mmkv, chat_id, messages) {
  if (!messages) return

  const skid = await getSkid()

  // is chat in storage check
  const chat = await getChatFromStorage(chat_id)
  if (!chat) return

  const key = chat?.key

  const rawDecrypted = await Promise.all(
    messages.map(async (message) => {
      let reply_to
      if (message?.reply_to) {
        try {
          const reply_to_message = getReplyToMessageFromStorage(message?.reply_to?.id)

          if (reply_to_message) {
            reply_to = reply_to_message
          } else {
            reply_to = await skid.message.decrypt(
              Buffer.from(key, 'hex'),
              restoreBytes(message?.reply_to),
              chat?.me?.id,
              chat?.recipient?.id,
            )
          }
        } catch {}
      }

      try {
        // if kyber message sent by recipient then decrypt using both key pairs
        // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
        const decrypted = await skid.message.decrypt(
          Buffer.from(chat?.key, 'hex'),
          restoreBytes(message),
          chat?.me?.id,
          chat?.recipient?.id,
        )

        return {
          ...decrypted,
          chat_id: message?.chat_id,
          id: message?.id,
          raw_date: decrypted?.date,
          date: formatSentTime(decrypted?.date),
          seen: message?.seen,
          nonce: message?.nonce,
          reply_to: reply_to
            ? {
                id: message?.reply_to?.id,
                chat_id: message?.chat_id,
                content: reply_to?.content,
                author_id: reply_to?.author_id,
                raw_date: reply_to?.date,
                date: formatSentTime(reply_to?.date),
                seen: message?.reply_to?.seen,
              }
            : null,
        }
      } catch {}

      return null
    }),
  )

  const decryptedMessages = rawDecrypted.filter(Boolean).map((message) => ({
    ...message,
    me: message?.author_id === chat?.me?.id,
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
          m.authorId = message.author_id
          m.date = new Date(message.date)
          m.nonce = message.nonce
          m.replyToId = message?.reply_to?.id
        })
      } else {
        await collection.create((m) => {
          m.serverId = message?.id
          m.chatId = message.chat_id
          m.content = message.content
          m.authorId = message.author_id
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
