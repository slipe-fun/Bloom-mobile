import { randomBytes } from '@noble/hashes/utils.js'
import deriveAesKey from './modules/crypto/aes/deriveAesKey'
import encryptCekWithKek from './modules/crypto/aes/encryptCekWithKek'
import { encryptKey as encrypt } from './modules/crypto/aes/encryptMessage'
import { hybridEncrypt } from './modules/crypto/hybrid/hybrid'
import generateIV from './modules/crypto/utils/generateIV'
import base64ToUint8Array from './modules/utils/base64ToUint8Array'
import bytesToBase64 from './modules/utils/bytesToBase64'

export default function encryptKey(content, sender, receiver, counter) {
  try {
    const { sessionKey: ssReceiver, cipherText: ctReceiver } = hybridEncrypt(
      base64ToUint8Array(receiver.ecdh_public_key),
      base64ToUint8Array(receiver.kyber_public_key),
      base64ToUint8Array(sender.ecdh_secret_key),
    )

    const cekRaw = randomBytes(32)

    const wrapSaltReceiver = randomBytes(32)
    const wrapIvReceiver = randomBytes(12)
    const kekReceiver = deriveAesKey(ssReceiver, wrapSaltReceiver)
    const wrappedCekReceiver = encryptCekWithKek(kekReceiver, wrapIvReceiver, cekRaw)

    const iv = generateIV(counter)

    const ciphertext = encrypt(cekRaw, iv, content)

    return {
      ciphertext: bytesToBase64(ciphertext),
      nonce: bytesToBase64(iv),
      encapsulated_key: bytesToBase64(ctReceiver),
      cek_wrap: bytesToBase64(wrappedCekReceiver),
      cek_wrap_iv: bytesToBase64(wrapIvReceiver),
      cek_wrap_salt: bytesToBase64(wrapSaltReceiver),
    }
  } catch (error) {
    console.log(error)
  }
}
