import 'react-native-get-random-values'

import { x448 } from '@noble/curves/ed448'

export default function deriveECDHSecret(privateKey, publicKey) {
  const fullSharedSecret = x448.getSharedSecret(privateKey, publicKey, true)
  return fullSharedSecret.slice(1)
}
