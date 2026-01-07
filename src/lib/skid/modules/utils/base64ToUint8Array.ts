export default function base64ToUint8Array(base64: string): Uint8Array {
  const binaryStr: string = atob(base64)
  const len: number = binaryStr.length
  const bytes: Uint8Array = new Uint8Array(len)
  for (let i: number = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes
}
