import { hkdf } from '@noble/hashes/hkdf.js'
import { sha256 } from '@noble/hashes/sha2.js'

export default function deriveAesKey(sessionKey: Uint8Array, salt: Uint8Array): Uint8Array {
  return hkdf(sha256, sessionKey, salt, new Uint8Array([]), 32)
}
