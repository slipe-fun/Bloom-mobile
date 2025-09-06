import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha2.js';

export default async function deriveAESKey(sessionKey, salt) {
  return hkdf(sha256, sessionKey, salt, new Uint8Array([]), 32);
}
