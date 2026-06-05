import crypto from 'react-native-quick-crypto'
import { buildAAD } from '../src/aad.js'
import { decrypt, encrypt } from '../src/aes.js'
import { hkdfExpand } from '../src/hkdf.js'
import { generateNonce } from '../src/keys.js'
import { sha256 } from '../src/utils.js'

export async function initiateKeyExchange(sender, receiver) {
  const senderMlPubKey = await crypto.subtle.importKey('raw-public', sender?.ml_kem?.public_key, { name: 'ML-KEM-768' }, true, [
    'encapsulateBits',
  ])
  const senderEncaps = await crypto.subtle.encapsulateBits({ name: 'ML-KEM-768' }, senderMlPubKey)
  const sender_cipher_text = Buffer.from(senderEncaps.ciphertext)
  const sender_pqc_shared_secret = Buffer.from(senderEncaps.sharedKey)

  const receiverMlPubKey = await crypto.subtle.importKey('raw-public', receiver?.ml_kem?.public_key, { name: 'ML-KEM-768' }, true, [
    'encapsulateBits',
  ])
  const receiverEncaps = await crypto.subtle.encapsulateBits({ name: 'ML-KEM-768' }, receiverMlPubKey)
  const receiver_cipher_text = Buffer.from(receiverEncaps.ciphertext)
  const receiver_pqc_shared_secret = Buffer.from(receiverEncaps.sharedKey)

  const ecdhPrivKey = await crypto.subtle.importKey('pkcs8', sender?.ecdh?.secret_key, { name: 'X448' }, true, ['deriveBits'])
  const ecdhPubKey = await crypto.subtle.importKey('raw', receiver?.ecdh?.public_key, { name: 'X448' }, true, [])
  const ecdhSharedSecretBits = await crypto.subtle.deriveBits({ name: 'X448', public: ecdhPubKey }, ecdhPrivKey, 448)
  const ecdhSharedSecret = Buffer.from(ecdhSharedSecretBits)

  const contextData = Buffer.concat([
    Buffer.from(new TextEncoder().encode(sender.id)),
    Buffer.from(new TextEncoder().encode(receiver.id)),
    sender.ecdh.public_key,
    receiver.ecdh.public_key,
    sender.ml_kem.public_key,
    receiver.ml_kem.public_key,
    sender_cipher_text,
    receiver_cipher_text,
  ])

  const session_id = sha256(contextData)

  const syncMaterial = Buffer.concat([sender_pqc_shared_secret, ecdhSharedSecret])
  const syncKey = await hkdfExpand(syncMaterial, session_id, new TextEncoder().encode(`skid:v3:sync_key`), 32)

  const nonce = generateNonce()

  const aad = buildAAD('sync_material', {
    session_id,
    sender_id: sender?.id,
    receiver_id: receiver?.id,
    sender_cipher_text,
    receiver_cipher_text,
  })

  const encrypted_sync_key = encrypt(syncKey, receiver_pqc_shared_secret, nonce, aad)

  const material = Buffer.concat([receiver_pqc_shared_secret, ecdhSharedSecret])

  const root_key = await hkdfExpand(material, session_id, new TextEncoder().encode(`skid:v3:root_key`), 32)

  const chat_key = await hkdfExpand(root_key, session_id, new TextEncoder().encode(`skid:v3:chat_key`), 32)

  return {
    payload: { receiver_cipher_text, sender_cipher_text, encrypted_sync_key },
    chat_key,
  }
}

export async function finalizeKeyExchange(payload, sender, receiver, isSelf = false) {
  let pqcSharedSecret
  let ecdhSharedSecret

  const contextData = Buffer.concat([
    Buffer.from(new TextEncoder().encode(sender.id)),
    Buffer.from(new TextEncoder().encode(receiver.id)),
    sender.ecdh.public_key,
    receiver.ecdh.public_key,
    sender.ml_kem.public_key,
    receiver.ml_kem.public_key,
    payload?.sender_cipher_text,
    payload?.receiver_cipher_text,
  ])

  const session_id = sha256(contextData)

  if (isSelf) {
    const ecdhPrivKey = await crypto.subtle.importKey('pkcs8', sender?.ecdh?.secret_key, { name: 'X448' }, true, ['deriveBits'])
    const ecdhPubKey = await crypto.subtle.importKey('raw', receiver?.ecdh?.public_key, { name: 'X448' }, true, [])
    const ecdhSharedSecretBits = await crypto.subtle.deriveBits({ name: 'X448', public: ecdhPubKey }, ecdhPrivKey, 448)
    ecdhSharedSecret = Buffer.from(ecdhSharedSecretBits)

    const mlKemPrivKey = await crypto.subtle.importKey('raw-seed', sender?.ml_kem?.secret_key, { name: 'ML-KEM-768' }, true, [
      'decapsulateBits',
    ])
    const pqcSharedSecret_A_bits = await crypto.subtle.decapsulateBits({ name: 'ML-KEM-768' }, mlKemPrivKey, payload?.sender_cipher_text)
    const pqcSharedSecret_A = Buffer.from(pqcSharedSecret_A_bits)

    const syncMaterial = Buffer.concat([pqcSharedSecret_A, ecdhSharedSecret])
    const syncKey = await hkdfExpand(syncMaterial, session_id, new TextEncoder().encode(`skid:v3:sync_key`), 32)

    const aad = buildAAD('sync_material', {
      session_id,
      sender_id: sender?.id,
      receiver_id: receiver?.id,
      sender_cipher_text: payload?.sender_cipher_text,
      receiver_cipher_text: payload?.receiver_cipher_text,
    })

    pqcSharedSecret = decrypt(syncKey, payload.encrypted_sync_key.ciphertext, payload.encrypted_sync_key.nonce, aad)
  } else {
    const ecdhPrivKey = await crypto.subtle.importKey('pkcs8', receiver?.ecdh?.secret_key, { name: 'X448' }, true, ['deriveBits'])
    const ecdhPubKey = await crypto.subtle.importKey('raw', sender?.ecdh?.public_key, { name: 'X448' }, true, [])
    const ecdhSharedSecretBits = await crypto.subtle.deriveBits({ name: 'X448', public: ecdhPubKey }, ecdhPrivKey, 448)
    ecdhSharedSecret = Buffer.from(ecdhSharedSecretBits)
    const mlKemPrivKey = await crypto.subtle.importKey('raw-seed', receiver?.ml_kem?.secret_key, { name: 'ML-KEM-768' }, true, [
      'decapsulateBits',
    ])
    const pqcSharedSecretBits = await crypto.subtle.decapsulateBits({ name: 'ML-KEM-768' }, mlKemPrivKey, payload?.receiver_cipher_text)
    pqcSharedSecret = Buffer.from(pqcSharedSecretBits)
  }

  const material = Buffer.concat([pqcSharedSecret, ecdhSharedSecret])

  const root_key = await hkdfExpand(material, session_id, new TextEncoder().encode(`skid:v3:root_key`), 32)

  const chat_key = await hkdfExpand(root_key, session_id, new TextEncoder().encode(`skid:v3:chat_key`), 32)

  return chat_key
}
