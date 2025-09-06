import { randomBytes } from '@noble/hashes/utils';

export default function generateIV(counter) {
  const totalLen = 12;
  const prefixLen = 4;
  const counterLen = 4;
  const paddingLen = totalLen - prefixLen - counterLen;

  const data = new Uint8Array(totalLen);

  data.set(randomBytes(prefixLen), 0);

  const counterBytes = new Uint8Array(4);
  counterBytes[0] = (counter >>> 24) & 0xff;
  counterBytes[1] = (counter >>> 16) & 0xff;
  counterBytes[2] = (counter >>> 8) & 0xff;
  counterBytes[3] = counter & 0xff;
  data.set(counterBytes, prefixLen);

  data.set(randomBytes(paddingLen), prefixLen + counterLen);

  return data;
}