import 'react-native-get-random-values'
import { x448 } from '@noble/curves/ed448.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js'

interface HybridEncrypt {
  sessionKey: Uint8Array
  cipherText: Uint8Array
}

interface HybridDecrypt {
  sessionKey: Uint8Array
}

export function hybridEncrypt(receiverECDHPub: Uint8Array, receiverKyberPub: Uint8Array, senderECDHPriv: Uint8Array): HybridEncrypt {
  const { cipherText, sharedSecret: pqcSharedSecret } = ml_kem768.encapsulate(receiverKyberPub)
  const ecdhSecret: Uint8Array = x448.getSharedSecret(senderECDHPriv, receiverECDHPub).slice(1)
  const sessionKey: Uint8Array = sha256(new Uint8Array([...pqcSharedSecret, ...ecdhSecret]))
  return { sessionKey, cipherText }
}

export function hybridDecrypt(
  senderECDHPub: Uint8Array,
  receiverECDHPriv: Uint8Array,
  receiverKyberPriv: Uint8Array,
  ciphertext: Uint8Array,
): HybridDecrypt {
  const pqcSharedSecret: Uint8Array = ml_kem768.decapsulate(ciphertext, receiverKyberPriv)
  const ecdhSecret: Uint8Array = x448.getSharedSecret(receiverECDHPriv, senderECDHPub).slice(1)
  const sessionKey: Uint8Array = sha256(new Uint8Array([...pqcSharedSecret, ...ecdhSecret]))
  return { sessionKey }
}
