import { gcm } from '@noble/ciphers/aes';

export default function encryptCekWithKek(kek, iv, cek) {
  const cipher = gcm(kek, iv);
  const wrappedCek = cipher.encrypt(cek);
  return wrappedCek;
}
