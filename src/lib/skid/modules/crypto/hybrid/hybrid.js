import 'react-native-get-random-values'
import { x448 } from '@noble/curves/ed448'
import { sha256 } from '@noble/hashes/sha2.js'
import { ml_kem768 } from '@noble/post-quantum/ml-kem'

export function hybridEncrypt(receiverECDHPub, receiverKyberPub, senderECDHPriv) {
  const { cipherText, sharedSecret: pqcSharedSecret } = ml_kem768.encapsulate(receiverKyberPub)
  const ecdhSecret = x448.getSharedSecret(senderECDHPriv, receiverECDHPub, true).slice(1)
  const sessionKey = sha256(new Uint8Array([...pqcSharedSecret, ...ecdhSecret]))
  return { sessionKey, cipherText }
}

export function hybridDecrypt(senderECDHPub, receiverECDHPriv, receiverKyberPriv, ct) {
  const pqcSharedSecret = ml_kem768.decapsulate(ct, receiverKyberPriv)
  const ecdhSecret = x448.getSharedSecret(receiverECDHPriv, senderECDHPub, true).slice(1)
  const sessionKey = sha256(new Uint8Array([...pqcSharedSecret, ...ecdhSecret]))
  return { sessionKey }
}
