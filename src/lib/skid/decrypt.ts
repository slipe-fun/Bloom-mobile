import decryptCekWithKek from './modules/crypto/aes/decryptCekWithKek'
import { decryptMessage } from './modules/crypto/aes/decryptMessage'
import deriveAesKey from './modules/crypto/aes/deriveAesKey'
import verifySignature from './modules/crypto/ed/verifySignature'
import { hybridDecrypt } from './modules/crypto/hybrid/hybrid'
import base64ToUint8Array from './modules/utils/base64ToUint8Array'
import type { EncryptedMessage } from './types/encryptedMessage'
import type { Message } from './types/message'
import type { UserKeys } from './types/userKeys'

export default function decrypt(
  payload: EncryptedMessage,
  me: UserKeys,
  sender: UserKeys,
  isAuthor: boolean = false,
): Message | string | Error {
  let cek: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array

  if (isAuthor) {
    const { sessionKey: ssSender } = hybridDecrypt(
      base64ToUint8Array(sender.ecdh_public_key),
      base64ToUint8Array(sender.ecdh_secret_key),
      base64ToUint8Array(sender.kyber_secret_key),
      base64ToUint8Array(payload.encapsulated_key_sender),
    )

    const kekSender: Uint8Array = deriveAesKey(ssSender, base64ToUint8Array(payload.cek_wrap_sender_salt))
    cek = decryptCekWithKek(kekSender, base64ToUint8Array(payload.cek_wrap_sender_iv), base64ToUint8Array(payload.cek_wrap_sender))
  } else {
    const { sessionKey: ssReceiver } = hybridDecrypt(
      base64ToUint8Array(sender.ecdh_public_key),
      base64ToUint8Array(me.ecdh_secret_key),
      base64ToUint8Array(me.kyber_secret_key),
      base64ToUint8Array(payload.encapsulated_key),
    )

    const kekReceiver: Uint8Array = deriveAesKey(ssReceiver, base64ToUint8Array(payload.cek_wrap_salt))
    cek = decryptCekWithKek(kekReceiver, base64ToUint8Array(payload.cek_wrap_iv), base64ToUint8Array(payload.cek_wrap))
  }

  const signatureValid: boolean = verifySignature(
    base64ToUint8Array(sender.ed_public_key),
    JSON.parse(payload?.signed_payload),
    payload.signature,
  )

  if (!signatureValid) {
    return new Error('Signature is not valid')
  }

  iv = base64ToUint8Array(payload.nonce)
  ciphertext = base64ToUint8Array(payload.ciphertext)

  return decryptMessage(cek, iv, ciphertext)
}
