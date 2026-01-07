import 'react-native-get-random-values'
import { Buffer } from '@craftzdog/react-native-buffer'
import type { RawEncryptedMessage } from '@lib/skid/types/encryptedMessage'
import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha2.js'

ed.hashes.sha512 = sha512
ed.hashes.sha512Async = (m) => Promise.resolve(sha512(m))

export default function verifySignature(publicKey: Uint8Array, payload: RawEncryptedMessage, signatureBase64: string): boolean {
  const encoded: Uint8Array = new TextEncoder().encode(JSON.stringify(payload, null, 2))
  const signature: Uint8Array = Buffer.from(signatureBase64, 'base64')
  return ed.verify(signature, encoded, publicKey)
}
