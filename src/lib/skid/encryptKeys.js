import { randomBytes } from "@noble/hashes/utils";
import { gcmsiv } from "@noble/ciphers/aes";
import RNSimpleCrypto from "react-native-simple-crypto";
import { Buffer } from '@craftzdog/react-native-buffer';

const toHex = RNSimpleCrypto.utils.convertArrayBufferToHex

export async function hashPassword(password, salt) {
  const _salt = salt ? salt : randomBytes(16);
  const hash = await RNSimpleCrypto.PBKDF2.hash(
      RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(password),
      _salt,
      600000,
      32,
      "SHA256"
    )

  return {
    hash: hash, 
    salt: _salt
  };
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