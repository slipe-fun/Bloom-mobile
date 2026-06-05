import crypto, { randomBytes } from 'react-native-quick-crypto'

function generateKeyPairAsync(type, options) {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(type, options, (err, publicKey, privateKey) => {
      if (err) return reject(err)
      resolve({ publicKey, privateKey })
    })
  })
}

export async function generate_E2EE_Keys() {
  const [mlKemResult, ecdhResult, edResult] = await Promise.all([
    crypto.subtle.generateKey({ name: 'ML-KEM-768' }, true, ['encapsulateKey', 'decapsulateKey']).then(async (keyPair) => {
      const [rawPubKey, rawSecKey] = await Promise.all([
        crypto.subtle.exportKey('raw-public', keyPair.publicKey),
        crypto.subtle.exportKey('raw-seed', keyPair.privateKey),
      ])
      return {
        public_key: Buffer.from(rawPubKey),
        secret_key: Buffer.from(rawSecKey),
      }
    }),

    generateKeyPairAsync('x448', {
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' },
    }),

    generateKeyPairAsync('ed448', {
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' },
    }),
  ])

  const ecdhPubKey = Buffer.from(ecdhResult.publicKey).subarray(12)
  const ecdhSecKey = Buffer.from(ecdhResult.privateKey).subarray(16)

  const edPubKey = Buffer.from(edResult.publicKey).subarray(12)
  const edSecKey = Buffer.from(edResult.privateKey).subarray(16)

  return {
    ml_kem: mlKemResult,
    ecdh: {
      public_key: ecdhPubKey,
      secret_key: ecdhSecKey,
    },
    ed: {
      public_key: edPubKey,
      secret_key: edSecKey,
    },
  }
}

export function generateByteKey(length) {
  return randomBytes(length)
}

export function generateNonce() {
  return randomBytes(12)
}

export function generateSalt() {
  return randomBytes(16)
}
