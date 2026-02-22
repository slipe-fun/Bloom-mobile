import decryptCekWithKek from './modules/crypto/aes/decryptCekWithKek'
import { decryptKey as decrypt } from './modules/crypto/aes/decryptMessage'
import deriveAesKey from './modules/crypto/aes/deriveAesKey'
import { hybridDecrypt } from './modules/crypto/hybrid/hybrid'
import base64ToUint8Array from './modules/utils/base64ToUint8Array'

export default function decryptKey(payload, receiver, sender) {
  try {
    const { ciphertext, nonce, encapsulated_key, cek_wrap, cek_wrap_iv, cek_wrap_salt } = payload

    const ssReceiver = hybridDecrypt(
      base64ToUint8Array(sender.ecdh_public_key),
      base64ToUint8Array(receiver.ecdh_secret_key),
      base64ToUint8Array(receiver.kyber_secret_key),
      base64ToUint8Array(encapsulated_key),
    )

    const kek = deriveAesKey(ssReceiver.sessionKey, base64ToUint8Array(cek_wrap_salt))

    const cek = decryptCekWithKek(kek, base64ToUint8Array(cek_wrap_iv), base64ToUint8Array(cek_wrap))

    const message = decrypt(cek, base64ToUint8Array(nonce), base64ToUint8Array(ciphertext))

    return message
  } catch (error) {
    console.log(error)
    throw error
  }
}
