import { randomBytes } from '@noble/hashes/utils';

export default function generatePadding() {
  const len = Math.floor(Math.random() * 128) + 32;
  const bytes = randomBytes(new Uint8Array(len));
  return btoa(String.fromCharCode(...bytes));
}