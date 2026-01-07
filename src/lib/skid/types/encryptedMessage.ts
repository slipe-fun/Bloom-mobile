export interface RawEncryptedMessage {
  ciphertext: string
  nonce: string
  encapsulated_key: string
  cek_wrap: string
  cek_wrap_iv: string
  cek_wrap_salt: string
  encapsulated_key_sender: string
  cek_wrap_sender: string
  cek_wrap_sender_iv: string
  cek_wrap_sender_salt: string
}

export interface EncryptedMessage extends RawEncryptedMessage {
  signed_payload: string
  signature: string
}
