import crypto from 'react-native-quick-crypto'

export function sha256(data) {
  return crypto.createHash('sha256').update(data).digest()
}

export function numberToBytes(number) {
  const buf = new ArrayBuffer(8)
  const view = new DataView(buf)

  view.setBigUint64(0, BigInt(number), false)

  return new Uint8Array(buf)
}

export function base64ToBytes(base64) {
  const binString = atob(base64)
  const len = binString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binString.charCodeAt(i)
  }
  return bytes
}

export function prepareForSigning(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Uint8Array) {
    return btoa(Array.from(obj, (byte) => String.fromCharCode(byte)).join(''))
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => prepareForSigning(item))
  }

  const cleaned = {}
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      cleaned[key] = prepareForSigning(obj[key])
    }
  }
  return cleaned
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

function simpleBytesToBase64(bytes) {
  if (!bytes) return ''
  const uint8 = new Uint8Array(bytes)
  let result = ''
  const len = uint8.length

  for (let i = 0; i < len; i += 3) {
    const b1 = uint8[i]
    const b2 = i + 1 < len ? uint8[i + 1] : 0
    const b3 = i + 2 < len ? uint8[i + 2] : 0

    const enc1 = b1 >> 2
    const enc2 = ((b1 & 3) << 4) | (b2 >> 4)
    let enc3 = ((b2 & 15) << 2) | (b3 >> 6)
    let enc4 = b3 & 63

    if (i + 1 >= len) {
      enc3 = 64
      enc4 = 64
    } else if (i + 2 >= len) {
      enc4 = 64
    }

    result += chars[enc1] + chars[enc2] + chars[enc3] + chars[enc4]
  }

  return result
}

export function bytesToBase64(obj) {
  if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) {
    return simpleBytesToBase64(obj)
  }

  if (obj instanceof ArrayBuffer) {
    return simpleBytesToBase64(new Uint8Array(obj))
  }

  if (Array.isArray(obj)) {
    return obj.map(bytesToBase64)
  }

  if (obj && typeof obj === 'object') {
    const result = {}

    for (const [key, value] of Object.entries(obj)) {
      result[key] = bytesToBase64(value)
    }

    return result
  }

  return obj
}

export function restoreBytes(obj) {
  if (obj instanceof Uint8Array) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(restoreBytes)
  }

  if (obj && typeof obj === 'object') {
    const result = {}

    for (const [key, value] of Object.entries(obj)) {
      result[key] = restoreBytes(value)
    }

    return result
  }

  if (typeof obj === 'string') {
    try {
      return base64ToBytes(obj)
    } catch {
      return obj
    }
  }

  return obj
}
