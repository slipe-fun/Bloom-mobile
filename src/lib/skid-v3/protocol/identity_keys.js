import crypto from 'react-native-quick-crypto'
import { buildAAD } from '../src/aad.js'
import { decrypt, encrypt } from '../src/aes.js'
import { hkdfExpand } from '../src/hkdf.js'
import { generateNonce, generateSalt } from '../src/keys.js'
import { base64ToBytes, bytesToBase64, prepareForSigning } from '../src/utils.js'

export async function encryptIdentityKeys(identity_keys, master_key, secret_sign_key) {
  const toEncrypt = new TextEncoder().encode(
    JSON.stringify({
      ml_kem_secret_key: bytesToBase64(identity_keys?.ml_kem?.secret_key),
      ecdh_secret_key: bytesToBase64(identity_keys?.ecdh?.secret_key),
      ed_secret_key: bytesToBase64(identity_keys?.ed?.secret_key),
    }),
  )

  const salt = generateSalt()
  const nonce = generateNonce()

  const derivedKey = await hkdfExpand(master_key, salt, new TextEncoder().encode('skid:v3:master_key'), 32)

  const aad = buildAAD('master_key', {
    nonce,
    ml_kem_public_key: identity_keys?.ml_kem?.public_key,
    ecdh_public_key: identity_keys?.ecdh?.public_key,
    ed_public_key: identity_keys?.ed?.public_key,
  })

  const encrypted = encrypt(derivedKey, toEncrypt, nonce, aad)

  const dataToSign = new TextEncoder().encode(
    JSON.stringify(
      prepareForSigning({
        ...encrypted,
        ml_kem_public_key: identity_keys?.ml_kem?.public_key,
        ecdh_public_key: identity_keys?.ecdh?.public_key,
        ed_public_key: identity_keys?.ed?.public_key,
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

export async function decryptIdentityKeys(encrypted_identity_keys, public_identity_keys, master_key, public_sign_key) {
  const derivedKey = await hkdfExpand(master_key, encrypted_identity_keys?.salt, new TextEncoder().encode('skid:v3:master_key'), 32)

  const aad = buildAAD('master_key', {
    nonce: encrypted_identity_keys?.nonce,
    ml_kem_public_key: public_identity_keys?.ml_kem?.public_key,
    ecdh_public_key: public_identity_keys?.ecdh?.public_key,
    ed_public_key: public_identity_keys?.ed?.public_key,
  })

  const dataToVerify = new TextEncoder().encode(
    JSON.stringify(
      prepareForSigning({
        ciphertext: encrypted_identity_keys?.ciphertext,
        nonce: encrypted_identity_keys?.nonce,
        ml_kem_public_key: public_identity_keys?.ml_kem?.public_key,
        ecdh_public_key: public_identity_keys?.ecdh?.public_key,
        ed_public_key: public_identity_keys?.ed?.public_key,
        salt: encrypted_identity_keys?.salt,
      }),
    ),
  )

  const pubKeyObj = await crypto.subtle.importKey('raw', public_sign_key, { name: 'Ed448' }, true, ['verify'])

  const isSignatureValid = await crypto.subtle.verify({ name: 'Ed448' }, pubKeyObj, encrypted_identity_keys?.signature, dataToVerify)

  if (!isSignatureValid) {
    throw new Error('invalid signature')
  }

  let identity_keys = decrypt(derivedKey, encrypted_identity_keys?.ciphertext, encrypted_identity_keys?.nonce, aad)

  identity_keys = new TextDecoder().decode(identity_keys)
  identity_keys = JSON.parse(identity_keys)

  return {
    ml_kem_secret_key: base64ToBytes(identity_keys?.ml_kem_secret_key),
    ecdh_secret_key: base64ToBytes(identity_keys?.ecdh_secret_key),
    ed_secret_key: base64ToBytes(identity_keys?.ed_secret_key),
  }
}
