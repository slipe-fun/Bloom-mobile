import 'react-native-get-random-values'

import { x448 } from '@noble/curves/ed448'
import { hmac } from '@noble/hashes/hmac.js'
import { sha256 } from '@noble/hashes/sha2.js'

export default function deriveECDHSecret(privateKey, publicKey) {
  const fullSharedSecret = x448.getSharedSecret(privateKey, publicKey, true)
  return fullSharedSecret.slice(1)
}
