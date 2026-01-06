import mergeAndSort from '@api/lib/utils/mergeAndSort'
import getChatFromStorage from '@lib/getChatFromStorage'
import decrypt from '@lib/skid/decrypt'
import { decrypt as sskDecrypt } from '@lib/skid/serversideKeyEncryption'
import Realm from 'realm'
import getChatMessages from '../getChatMessages'
import getReplyToMessageFromStorage from '../getReplyToMessageFromStorage'

export default async function (realm, mmkv, setMessages, chat_id) {
  // last saved message
  const lastMessage = realm.objects('Message').filtered('chat_id == $0', chat_id).sorted('id', true)[0] ?? null

  // get messages from api sent after last message
  const messages = await getChatMessages(chat_id, lastMessage?.id || 0)

  // is chat in storage check
  const chat = await getChatFromStorage(chat_id)
  if (!chat) return

  // kyber, ecdh, ed keys
  const myKeys = chat?.keys?.my
  const recipientKeys = chat?.keys?.recipient

  const key = chat?.encryption_key

  // user id
  const userId = parseInt(mmkv.getString('user_id'), 10)

  const decryptedMessages = messages
    .map((message) => {
      let reply_to
      if (message?.reply_to) {
        try {
          const reply_to_message = getReplyToMessageFromStorage(realm, message?.reply_to?.id)

          if (reply_to_message) {
            reply_to = reply_to_message
          } else {
            reply_to = message?.encapsulated_key
              ? decrypt(message?.reply_to, myKeys, recipientKeys, false)
              : sskDecrypt(message?.reply_to?.ciphertext, message?.reply_to?.nonce, key)
          }
        } catch {}
      }

      try {
        // if kyber message sent by recipient then decrypt using both key pairs
        // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
        return {
          ...(message?.encapsulated_key
            ? decrypt(message, myKeys, recipientKeys, false)
            : sskDecrypt(message?.ciphertext, message?.nonce, chat?.key)),
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
      } catch (error) {
        // if kyber message sent by user (current session user) decrypt using only his keys
        if (error.message === 'invalid polyval tag') {
          try {
            return {
              ...decrypt(message, myKeys, myKeys, true),
              chat_id: message?.chat_id,
              id: message?.id,
              seen: message?.seen,
              nonce: message?.nonce,
              reply_to: reply_to
                ? {
                    id: message?.reply_to?.id,
                    chat_id: message?.chat_id,
                    content: reply_to?.content,
                    author_id: reply_to?.from_id,
                    date: reply_to?.date,
                    seen: message?.reply_to?.seen,
                  }
                : null,
            }
          } catch {}
        }
      }

      return null
    })
    .filter(Boolean)
    .map((message) => ({
      ...message,
      isMe: message?.from_id === userId,
    }))

  setMessages((prev) => mergeAndSort(prev, decryptedMessages))

  // write decrypted messages to local storage
  realm.write(() => {
    decryptedMessages.forEach((message) => {
      realm.create(
        'Message',
        {
          id: message?.id,
          chat_id: message?.chat_id,
          content: message?.content,
          author_id: message?.from_id,
          date: new Date(message?.date),
          seen: null,
          nonce: message?.nonce,
          reply_to: message?.reply_to,
        },
        Realm.UpdateMode.Modified,
      )
    })
  })
}
