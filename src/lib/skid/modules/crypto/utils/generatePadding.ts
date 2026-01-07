import { randomBytes } from '@noble/hashes/utils.js'

export default function generatePadding(): string {
  const len: number = Math.floor(Math.random() * 128) + 32
  const bytes: Uint8Array = randomBytes(len)
  return btoa(String.fromCharCode(...bytes))
}
