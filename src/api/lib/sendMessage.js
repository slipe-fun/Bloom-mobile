import getChatFromStorage from '../../lib/getChatFromStorage'
import encrypt from '../../lib/skid/encrypt'
import { encrypt as sskEncrypt } from '../../lib/skid/serversideKeyEncryption'
import { createSecureStorage } from '../../lib/storage'

export default async function (content, reply_to, chat_id, count, ws) {
  try {
    // mmkv storage
    const storage = await createSecureStorage('user-storage')
    // get chat from mmkv storage
    const chatData = await getChatFromStorage(chat_id)

    let encrypted

    // if recipient dont assigned keys use skid soft mode
    if (!chatData?.keys?.recipient?.kyberPublicKey) {
      try {
        // skid soft mode (or serversidekey = ssk) encryption
        // need message content, current user id, chat key
        encrypted = sskEncrypt(content, parseInt(storage?.getString('user_id'), 10), chatData?.key)

        // send message socket
        ws.send(
          JSON.stringify({
            type: 'send',
            chat_id: chat_id,
            ciphertext: encrypted.ciphertext,
            nonce: encrypted.nonce,
            reply_to,
            encryption_type: 'server',
          }),
        )

        return encrypted?.nonce
      } catch {
        return
      }
    }

    // IF HEAVY SKID ENCRYPTION TYPE
    // encrypt message
    encrypted = encrypt(
      content,
      { ...chatData?.keys?.my, id: parseInt(storage.getString('user_id'), 10) },
      chatData?.keys?.recipient,
      count,
    )

    // send encrypted message socket
    ws.send(
      JSON.stringify({
        type: 'send',
        encryption_type: 'client',
        chat_id: chat_id,
        reply_to,
        ...encrypted,
      }),
    )

    return encrypted?.nonce
  } catch {}
}
