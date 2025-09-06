import { gcm } from "@noble/ciphers/aes";

export default function decryptMessage(cekRaw, iv, ciphertext) {
  const cipher = gcm(cekRaw, iv);
  const plain = cipher.decrypt(ciphertext);
  const decoded = new TextDecoder().decode(plain);
  try {
    return JSON.parse(decoded);
  } catch {
    return decoded;
  }
}
