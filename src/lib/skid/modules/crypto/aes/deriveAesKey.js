import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha2';

export default function deriveAesKey(sessionKey, salt) {
  return hkdf(sha256, sessionKey, salt, new Uint8Array([]), 32);
}
