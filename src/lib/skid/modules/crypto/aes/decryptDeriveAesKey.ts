import { hkdf } from '@noble/hashes/hkdf.js'
import { sha256 } from '@noble/hashes/sha2.js'

export default async function deriveAESKey(sessionKey: Uint8Array, salt: Uint8Array): Promise<Uint8Array> {
  return hkdf(sha256, sessionKey, salt, new Uint8Array([]), 32)
}
