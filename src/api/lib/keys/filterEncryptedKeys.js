export default function (keys) {
  return keys?.filter(
    (k) =>
      k &&
      k.chat_id > 0 &&
      k.recipient > 0 &&
      k.session_id > 0 &&
      typeof k.encrypted_key === 'string' &&
      k.encrypted_key.length > 0 &&
      typeof k.encapsulated_key === 'string' &&
      k.encapsulated_key.length > 0 &&
      typeof k.nonce === 'string' &&
      k.nonce.length > 0 &&
      typeof k.salt === 'string' &&
      k.salt.length > 0,
  )
}
