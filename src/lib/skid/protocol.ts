import decryptKey from './decryptKey'
import encryptKey from './encryptKey'
import { decryptKeys, encryptKeys, hashPassword } from './encryptKeys'
import generateKeys from './generateKeys'
import { decrypt as sskDecrypt, encrypt as sskEncrypt } from './serversideKeyEncryption'

export default {
  local: {
    generateKeys,
    encryptKey,
    decryptKey,
  },
  aes: {
    encrypt: sskEncrypt,
    decrypt: sskDecrypt,
  },
  server: {
    hashPassword,
    encryptKeys,
    decryptKeys,
  },
}
