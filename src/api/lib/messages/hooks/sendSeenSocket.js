import readMessagesRequest from '@api/lib/messages/read'
import { Q } from '@nozbe/watermelondb'
import { database } from 'src/db'

export default async function (ws, chat_id, messages, setMessages) {
  try {
    const lastMessage = messages[0]

    // if message not seen and message sent by recipient
    if (!lastMessage?.seen && !lastMessage?.me) {
      // send read messages request
      const response = await readMessagesRequest(chat_id, [lastMessage?.id])
      if (!response) return

      // change seen status in local storage
      await database.write(async () => {
        const collection = await database.get('messages')

        const msgs = await collection.query(Q.where('server_id', lastMessage?.id)).fetch()
        const msg = msgs[0]
        if (msg)
          await msg.update((m) => {
            m.seen = new Date()
          })
      })

      setMessages((prev) =>
        prev?.map((message) => {
          // change only last message status
          if (message?.id === lastMessage?.id) {
            return { ...message, seen: new Date().toString() }
          }
          return message
        }),
      )
    }

    // get last unseen message from local storage
    const lastUnseenMessage = [...messages].reverse().find((m) => !m.seen && !m.me)
    if (!lastUnseenMessage) return

    // send read request for last unseen message
    const response = await readMessagesRequest(chat_id, [lastUnseenMessage?.id])
    if (!response) return

    // change last unseen message status in local storage
    await database.write(async () => {
      const collection = await database.get('messages')

      const msgs = await collection.query(Q.where('server_id', lastUnseenMessage?.id)).fetch()
      const msg = msgs[0]
      if (msg)
        await msg.update((m) => {
          m.seen = new Date()
        })
    })

    setMessages((prev) =>
      prev?.map((message) => {
        // change only last unseen message status
        if (message?.id === lastUnseenMessage?.id) {
          return { ...message, seen: new Date().toString() }
        }
        return message
      }),
    )
  } catch {}
}
