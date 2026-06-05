export function buildAAD(type, fields = {}) {
  const contextTag = `skid:v3:${type}`

  const normalizedFields = {}
  for (const [key, value] of Object.entries(fields)) {
    if (Buffer.isBuffer(value)) {
      normalizedFields[key] = value
    } else if (value instanceof Uint8Array || Array.isArray(value)) {
      normalizedFields[key] = Buffer.from(value)
    } else {
      normalizedFields[key] = value
    }
  }

  const base = {
    context: contextTag,
    version: 3,
    ...normalizedFields,
  }

  return new TextEncoder().encode(JSON.stringify(base))
}
