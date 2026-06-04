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

export function bytesToBase64(obj) {
  if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) {
    return Buffer.from(obj).toString('base64')
  }

  if (obj instanceof ArrayBuffer) {
    return Buffer.from(new Uint8Array(obj)).toString('base64')
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
