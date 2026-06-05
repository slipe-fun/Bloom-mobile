import crypto from 'react-native-quick-crypto'

export async function hkdfExpand(key, salt, info, length) {
  return new Promise((resolve, reject) => {
    crypto.hkdf('sha256', key, salt, info, length, (err, derivedKey) => {
      if (err) return reject(err)

      resolve(Buffer.from(derivedKey))
    })
  })
}
