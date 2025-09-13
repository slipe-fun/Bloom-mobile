import { gcmsiv } from "@noble/ciphers/aes";

export default function decryptCekWithKek(kek, iv, wrappedCek) {
  const cipher = gcmsiv(kek, iv);
  return cipher.decrypt(wrappedCek);
}
