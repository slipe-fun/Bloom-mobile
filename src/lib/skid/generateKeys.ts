import 'react-native-get-random-values'
import { x448 } from '@noble/curves/ed448.js'
import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha2.js'
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js'

import bytesToBase64 from './modules/utils/bytesToBase64'
import type { Keys } from './types/keys'

ed.hashes.sha512 = sha512
ed.hashes.sha512Async = (message: Uint8Array): Promise<Uint8Array> => Promise.resolve(sha512(message))

export default function (): Keys {
  const { publicKey: kyberPublicKey, secretKey: kyberSecretKey } = ml_kem768.keygen()
  const { publicKey: ecdhPublicKey, secretKey: ecdhSecretKey } = x448.keygen()
  const { publicKey: edPublicKey, secretKey: edSecretKey } = ed.keygen()

  return {
    kyberPublicKey: bytesToBase64(kyberPublicKey),
    kyberSecretKey: bytesToBase64(kyberSecretKey),
    ecdhPublicKey: bytesToBase64(ecdhPublicKey),
    ecdhSecretKey: bytesToBase64(ecdhSecretKey),
    edPublicKey: bytesToBase64(edPublicKey),
    edSecretKey: bytesToBase64(edSecretKey),
  }
}
