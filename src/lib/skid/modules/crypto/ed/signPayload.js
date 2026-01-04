import 'react-native-get-random-values'
import { Buffer } from '@craftzdog/react-native-buffer'

import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha2.js'

ed.hashes.sha512 = sha512
ed.hashes.sha512Async = (m) => Promise.resolve(sha512(m))

export default function signPayload(privateKey, payload) {
  const encoded = new TextEncoder().encode(JSON.stringify(payload, null, 2))
  const signature = ed.sign(encoded, privateKey)
  return Buffer.from(signature).toString('base64')
}
