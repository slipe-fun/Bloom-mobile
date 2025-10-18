import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { gcmsiv } from '@noble/ciphers/aes.js';
import { randomBytes } from '@noble/ciphers/utils.js';
import { Buffer } from '@craftzdog/react-native-buffer';
import generatePadding from './modules/crypto/utils/generatePadding';

export function encrypt(content, user_id, key) {
  const nonce = randomBytes(12);

  const aes = gcmsiv(Uint8Array.from(Buffer.from(key, "base64")), nonce);

  const ciphertext = aes.encrypt(new TextEncoder().encode(JSON.stringify({
    content,
    from_id: user_id,
    date: new Date(),
    padding: generatePadding()
  })));

  return { 
    ciphertext: Buffer.from(ciphertext).toString("base64"),
    nonce: Buffer.from(nonce).toString("base64")
  };
}

export function decrypt(encrypted, nonce, key) {
  const aes = gcmsiv(Uint8Array.from(Buffer.from(key, "base64")), Uint8Array.from(Buffer.from(nonce, "base64")));
  const ciphertext = aes.decrypt(Uint8Array.from(Buffer.from(encrypted, "base64")));

  return JSON.parse(new TextDecoder().decode(ciphertext))
}