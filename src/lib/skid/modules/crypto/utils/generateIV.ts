import { randomBytes } from '@noble/hashes/utils.js'

export default function generateIV(counter: number): Uint8Array {
  const totalLen: number = 12
  const prefixLen: number = 4
  const counterLen: number = 4
  const paddingLen: number = totalLen - prefixLen - counterLen

  const data: Uint8Array = new Uint8Array(totalLen)

  data.set(randomBytes(prefixLen), 0)

  const counterBytes: Uint8Array = new Uint8Array(4)
  counterBytes[0] = (counter >>> 24) & 0xff
  counterBytes[1] = (counter >>> 16) & 0xff
  counterBytes[2] = (counter >>> 8) & 0xff
  counterBytes[3] = counter & 0xff
  data.set(counterBytes, prefixLen)

  data.set(randomBytes(paddingLen), prefixLen + counterLen)

  return data
}
