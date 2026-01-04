import 'react-native-get-random-values'
import { x448 } from '@noble/curves/ed448'
import * as ed from '@noble/ed25519'
import { hmac } from '@noble/hashes/hmac.js'
import { sha256, sha512 } from '@noble/hashes/sha2.js'
import { ml_kem768 } from '@noble/post-quantum/ml-kem'

import bytesToBase64 from './modules/utils/bytesToBase64'

ed.hashes.sha512 = sha512
ed.hashes.sha512Async = (m) => Promise.resolve(sha512(m))

export default function () {
  const { publicKey: kyberPublicKey, secretKey: kyberSecretKey } = ml_kem768.keygen()
  const { publicKey: ecdhPublicKey, secretKey: ecdhSecretKey } = x448.keygen()
  const { publicKey: edPublicKey, secretKey: edSecretKey } = ed.keygen()

  return {
    kyberPublicKey: bytesToBase64(kyberPublicKey),
    kyberSecretKey: bytesToBase64(kyberSecretKey),
    ecdhPublicKey: bytesToBase64(ecdhPublicKey),
    ecdhSecretKey: bytesToBase64(ecdhSecretKey),
    edPublicKey: bytesToBase64(edPublicKey),
    edSecretKey: bytesToBase64(edSecretKey),
  }
}
