import { Buffer } from '@craftzdog/react-native-buffer'
import { sha256 } from '@noble/hashes/sha2.js'
import { ml_kem768 } from '@noble/post-quantum/ml-kem'
import deriveECDHSecret from './deriveECDHSecret.js'
import base64ToUint8Array from './utils/base64ToUint8Array.js'

export default async function deriveHybridSessionKey(encapsulatedKeyB64, peerECDHPublicKeyB64, kyberPrivateKeyB64, ecdhPrivateKeyB64) {
  const encapsulatedKey = base64ToUint8Array(encapsulatedKeyB64)
  const peerECDHPublicKey = base64ToUint8Array(peerECDHPublicKeyB64)
  const ecdhPrivateKey = base64ToUint8Array(ecdhPrivateKeyB64)
  const kyberPrivateKey = base64ToUint8Array(kyberPrivateKeyB64)

  const pqSharedSecret = ml_kem768.decapsulate(encapsulatedKey, kyberPrivateKey)

  const ecdhSecret = deriveECDHSecret(ecdhPrivateKey, peerECDHPublicKey)

  const hybridKeyMaterial = new Uint8Array([...pqSharedSecret, ...ecdhSecret])

  return sha256(hybridKeyMaterial)
}
