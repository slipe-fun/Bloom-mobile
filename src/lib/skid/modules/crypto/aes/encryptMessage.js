import { gcmsiv } from '@noble/ciphers/aes';

export default function encryptMessage(aesKey, iv, messageObject) {
  const plaintext = new TextEncoder().encode(JSON.stringify(messageObject));
  const cipher = gcmsiv(aesKey, iv);
  return cipher.encrypt(plaintext);
}
