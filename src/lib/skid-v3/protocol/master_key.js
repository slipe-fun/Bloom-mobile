import crypto from 'react-native-quick-crypto'
import { buildAAD } from '../src/aad.js'
import { decrypt, encrypt } from '../src/aes.js'
import { hkdfExpand } from '../src/hkdf.js'
import { generateNonce, generateSalt } from '../src/keys.js'
import { prepareForSigning } from '../src/utils.js'

export async function encryptMasterKey(master_key, recovery_key, secret_sign_key) {
  const salt = generateSalt()
  const nonce = generateNonce()

  const derivedKey = await hkdfExpand(recovery_key, salt, new TextEncoder().encode('skid:v3:recovery_key'), 32)

  const aad = buildAAD('master_key', {
    nonce,
  })

  const encrypted = encrypt(derivedKey, master_key, nonce, aad)

  const dataToSign = new TextEncoder().encode(
    JSON.stringify(
      prepareForSigning({
        ...encrypted,
        salt,
      }),
    ),
  )

  const privKeyObj = await crypto.subtle.importKey('pkcs8', secret_sign_key, { name: 'Ed448' }, true, ['sign'])

  const signatureBits = await crypto.subtle.sign({ name: 'Ed448' }, privKeyObj, dataToSign)
  const signature = Buffer.from(signatureBits)

  return {
    ...encrypted,
    signature,
    salt,
  }
}

export async function decryptMasterKey(encrypted_master_key, recovery_key, public_sign_key) {
  const derivedKey = await hkdfExpand(recovery_key, encrypted_master_key?.salt, new TextEncoder().encode('skid:v3:recovery_key'), 32)

  const aad = buildAAD('master_key', {
    nonce: encrypted_master_key?.nonce,
  })

  const dataToVerify = new TextEncoder().encode(
    JSON.stringify(
      prepareForSigning({
        ciphertext: encrypted_master_key?.ciphertext,
        nonce: encrypted_master_key?.nonce,
        salt: encrypted_master_key?.salt,
      }),
    ),
  )

  const pubKeyObj = await crypto.subtle.importKey('raw', public_sign_key, { name: 'Ed448' }, true, ['verify'])

  const isSignatureValid = await crypto.subtle.verify({ name: 'Ed448' }, pubKeyObj, encrypted_master_key?.signature, dataToVerify)

  if (!isSignatureValid) {
    throw new Error('invalid signature')
  }

  return decrypt(derivedKey, encrypted_master_key?.ciphertext, encrypted_master_key?.nonce, aad)
}
