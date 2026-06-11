export interface SKID {
  keys: {
    identity: {
      generate: () => Promise<{
        ml_kem: { public_key: Buffer<ArrayBuffer>; secret_key: Buffer<ArrayBuffer> }
        ecdh: { public_key: Buffer<any>; secret_key: Buffer<any> }
        ed: { public_key: Buffer<any>; secret_key: Buffer<any> }
      }>
      encrypt: (
        identity_keys: any,
        master_key: any,
        secret_sign_key: any,
      ) => Promise<{
        signature: Buffer<ArrayBuffer>
        salt: Uint8Array<ArrayBufferLike>
        ciphertext: Uint8Array<ArrayBufferLike>
        nonce: any
      }>
      decrypt: (
        encrypted_identity_keys: any,
        public_identity_keys: any,
        master_key: any,
        public_sign_key: any,
      ) => Promise<{
        ml_kem_secret_key: Uint8Array<ArrayBuffer>
        ecdh_secret_key: Uint8Array<ArrayBuffer>
        ed_secret_key: Uint8Array<ArrayBuffer>
      }>
    }
    master_key: {
      generate: () => Uint8Array<ArrayBufferLike>
      encrypt: (
        master_key: any,
        recovery_key: any,
        secret_sign_key: any,
      ) => Promise<{
        signature: Buffer<ArrayBuffer>
        salt: Uint8Array<ArrayBufferLike>
        ciphertext: Uint8Array<ArrayBufferLike>
        nonce: any
      }>
      decrypt: (encrypted_master_key: any, recovery_key: any, public_sign_key: any) => Promise<Uint8Array<ArrayBufferLike>>
    }
    recovery_key: {
      generate: () => Uint8Array<ArrayBufferLike>
      mnemonic: { get: (key: any) => string }
      entropy: { get: (mnemonic: any) => Uint8Array<ArrayBufferLike> }
    }
  }
  handshake: {
    initiate: (
      sender: any,
      receiver: any,
    ) => Promise<{
      payload: {
        receiver_cipher_text: Buffer<ArrayBuffer>
        sender_cipher_text: Buffer<ArrayBuffer>
        encrypted_sync_key: { ciphertext: Uint8Array<ArrayBufferLike>; nonce: any }
      }
      chat_key: any
    }>
    finalize: (payload: any, sender: any, receiver: any, isSelf: boolean) => Promise<any>
  }
  message: {
    encrypt: (
      key: any,
      content: any,
      sender: any,
      receiver: any,
    ) => Promise<{
      salt: Uint8Array<ArrayBufferLike>
      ciphertext: Uint8Array<ArrayBufferLike>
      nonce: any
    }>
    decrypt: (key: any, message: any, sender: any, receiver: any) => Promise<Uint8Array<ArrayBufferLike>>
  }
}
