import 'react-native-get-random-values'
import { Buffer } from '@craftzdog/react-native-buffer'

import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha2.js'

ed.hashes.sha512 = sha512
ed.hashes.sha512Async = (m) => Promise.resolve(sha512(m))

export default function verifySignature(publicKey, payload, signatureBase64) {
  const encoded = new TextEncoder().encode(JSON.stringify(payload, null, 2))
  const signature = Buffer.from(signatureBase64, 'base64')
  const isValid = ed.verify(signature, encoded, publicKey)
  return isValid
}
