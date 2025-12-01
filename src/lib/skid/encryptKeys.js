import { randomBytes } from "@noble/hashes/utils";
import { gcmsiv } from "@noble/ciphers/aes";
import { Buffer } from '@craftzdog/react-native-buffer';
import QuickCrypto from 'react-native-quick-crypto';

export async function hashPassword(password, salt) {
  const _salt = salt ? salt : randomBytes(16);

  return new Promise((resolve, reject) => {
    QuickCrypto.pbkdf2(
      password,
      _salt,
      600000,
      32,
      "sha256",
      (err, hash) => {
        if (err) return reject(err);

        resolve({
          hash: hash,
          salt: _salt,
        });
      }
    );
  });
}

export function encryptKeys(key, content) {
  const nonce = randomBytes(12);
  const aes = gcmsiv(Uint8Array.from(Buffer.from(key, "base64")), nonce);
  const ciphertext = aes.encrypt(content);

  return {
    ciphertext: Buffer.from(ciphertext).toString("base64"),
    nonce: Buffer.from(nonce).toString("base64")
  }
}

export function decryptKeys(key, ct, nonce) {
  const aes = gcmsiv(Uint8Array.from(Buffer.from(key, "base64")), Uint8Array.from(Buffer.from(nonce, "base64")));
  const ciphertext = aes.decrypt(Uint8Array.from(Buffer.from(ct, "base64")));
  let decrypted = new TextDecoder().decode(ciphertext);

  try {
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
}