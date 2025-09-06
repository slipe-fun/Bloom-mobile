import 'react-native-get-random-values';
import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';

import * as secp from "@noble/secp256k1";

secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256 = sha256;
secp.hashes.hmacSha256Async = async (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256Async = async (msg) => sha256(msg);

export default function deriveECDHSecret(privateKey, publicKey) {
  const fullSharedSecret = secp.getSharedSecret(privateKey, publicKey, true);
  return fullSharedSecret.slice(1);
}
