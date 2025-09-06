import 'react-native-get-random-values';
import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { sha512 } from '@noble/hashes/sha2.js';

import { ml_kem768 } from "@noble/post-quantum/ml-kem";
import * as secp from '@noble/secp256k1';
import * as ed from "@noble/ed25519";

import bytesToBase64 from './modules/utils/bytesToBase64';

secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256 = sha256;
secp.hashes.hmacSha256Async = async (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256Async = async (msg) => sha256(msg);
ed.hashes.sha512 = sha512;
ed.hashes.sha512Async = (m) => Promise.resolve(sha512(m));

export default async function () {
    const { publicKey: kyberPublicKey, secretKey: kyberSecretKey } = ml_kem768.keygen();
    const { publicKey: ecdhPublicKey, secretKey: ecdhSecretKey } = secp.keygen();
    const { publicKey: edPublicKey, secretKey: edSecretKey } = ed.keygen()

    return { 
        kyberPublicKey: bytesToBase64(kyberPublicKey), kyberSecretKey: bytesToBase64(kyberSecretKey),
        ecdhPublicKey: bytesToBase64(ecdhPublicKey), ecdhSecretKey: bytesToBase64(ecdhSecretKey),
        edPublicKey: bytesToBase64(edPublicKey), edSecretKey: bytesToBase64(edSecretKey)
    }
}