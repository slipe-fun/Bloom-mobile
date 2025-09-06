import { gcm } from '@noble/ciphers/aes';

export default function encryptMessage(aesKey, iv, messageObject) {
  const plaintext = new TextEncoder().encode(JSON.stringify(messageObject));
  const cipher = gcm(aesKey, iv);
  return cipher.encrypt(plaintext);
}
