import { Buffer } from '@craftzdog/react-native-buffer'

export default function (data: Uint8Array): string {
  return Buffer.from(data).toString('base64')
}
