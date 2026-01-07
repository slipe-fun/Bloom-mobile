import { randomBytes } from '@noble/hashes/utils.js'
import deriveAesKey from './modules/crypto/aes/deriveAesKey'
import encryptCekWithKek from './modules/crypto/aes/encryptCekWithKek'
import encryptMessage from './modules/crypto/aes/encryptMessage'
import signPayload from './modules/crypto/ed/signPayload'
import { hybridEncrypt } from './modules/crypto/hybrid/hybrid'
import generateIV from './modules/crypto/utils/generateIV'
import generatePadding from './modules/crypto/utils/generatePadding'
import base64ToUint8Array from './modules/utils/base64ToUint8Array'
import bytesToBase64 from './modules/utils/bytesToBase64'
import type { EncryptedMessage } from './types/encryptedMessage'
import type { Message } from './types/message'
import type { UserKeys } from './types/userKeys'

export default function encrypt(content: string, sender: UserKeys, receiver: UserKeys, counter: number): EncryptedMessage {
  const { sessionKey: ssReceiver, cipherText: ctReceiver } = hybridEncrypt(
    base64ToUint8Array(receiver.ecdhPublicKey),
    base64ToUint8Array(receiver.kyberPublicKey),
    base64ToUint8Array(sender.ecdhSecretKey),
  )

  const cekRaw: Uint8Array = randomBytes(32)

  const wrapSaltReceiver: Uint8Array = randomBytes(32)
  const wrapIvReceiver: Uint8Array = randomBytes(12)
  const kekReceiver: Uint8Array = deriveAesKey(ssReceiver, wrapSaltReceiver)
  const wrappedCekReceiver: Uint8Array = encryptCekWithKek(kekReceiver, wrapIvReceiver, cekRaw)

  const { sessionKey: ssSender, cipherText: ctSender } = hybridEncrypt(
    base64ToUint8Array(sender.ecdhPublicKey),
    base64ToUint8Array(sender.kyberPublicKey),
    base64ToUint8Array(sender.ecdhSecretKey),
  )

  const wrapSaltSender: Uint8Array = randomBytes(32)
  const wrapIvSender: Uint8Array = randomBytes(12)
  const kekSender: Uint8Array = deriveAesKey(ssSender, wrapSaltSender)
  const wrappedCekSender: Uint8Array = encryptCekWithKek(kekSender, wrapIvSender, cekRaw)

  const iv: Uint8Array = generateIV(counter)
  const message: Message = {
    content,
    from_id: sender?.id || 'unknown',
    date: new Date(),
    padding: generatePadding(),
  }
  const ciphertext: Uint8Array = encryptMessage(cekRaw, iv, message)

  const toSign = {
    ciphertext: bytesToBase64(ciphertext),
    nonce: bytesToBase64(iv),
    encapsulated_key: bytesToBase64(ctReceiver),
    cek_wrap: bytesToBase64(wrappedCekReceiver),
    cek_wrap_iv: bytesToBase64(wrapIvReceiver),
    cek_wrap_salt: bytesToBase64(wrapSaltReceiver),
    encapsulated_key_sender: bytesToBase64(ctSender),
    cek_wrap_sender: bytesToBase64(wrappedCekSender),
    cek_wrap_sender_iv: bytesToBase64(wrapIvSender),
    cek_wrap_sender_salt: bytesToBase64(wrapSaltSender),
  }

  const signature: string = signPayload(base64ToUint8Array(sender.edSecretKey), toSign)

  return {
    ...toSign,
    signed_payload: JSON.stringify(toSign, null, 2),
    signature,
  }
}
