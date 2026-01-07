export default function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}
