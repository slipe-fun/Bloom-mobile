import { gcmsiv } from '@noble/ciphers/aes';

export default function encryptCekWithKek(kek, iv, cek) {
  const cipher = gcmsiv(kek, iv);
  const wrappedCek = cipher.encrypt(cek);
  return wrappedCek;
}
