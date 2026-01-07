export default function btoaToUint8Array(str: string): Uint8Array {
  if (!str) return new Uint8Array()
  const binary: string = atob(str)
  const len: number = binary.length
  const arr: Uint8Array = new Uint8Array(len)
  for (let i: number = 0; i < len; i++) arr[i] = binary.charCodeAt(i)
  return arr
}
