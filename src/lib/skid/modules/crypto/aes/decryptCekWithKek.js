import { gcm } from "@noble/ciphers/aes";

export default function decryptCekWithKek(kek, iv, wrappedCek) {
  const cipher = gcm(kek, iv);
  return cipher.decrypt(wrappedCek);
}
