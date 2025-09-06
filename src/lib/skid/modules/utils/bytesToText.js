export default function bytesToText(bytes) {
  return new TextDecoder().decode(bytes);
}