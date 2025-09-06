import 'react-native-get-random-values';
import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { ml_kem768 } from "@noble/post-quantum/ml-kem";
import * as secp from '@noble/secp256k1';

secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256 = sha256;
secp.hashes.hmacSha256Async = async (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256Async = async (msg) => sha256(msg);

export function hybridEncrypt(receiverECDHPub, receiverKyberPub, senderECDHPriv) {
    const { cipherText, sharedSecret: pqcSharedSecret } = ml_kem768.encapsulate(receiverKyberPub);
    const ecdhSecret = secp.getSharedSecret(senderECDHPriv, receiverECDHPub, true).slice(1);
    const sessionKey = sha256(new Uint8Array([...pqcSharedSecret, ...ecdhSecret]));
    return { sessionKey, cipherText };
}

export function hybridDecrypt(senderECDHPub, receiverECDHPriv, receiverKyberPriv, ct) {
    const pqcSharedSecret = ml_kem768.decapsulate(ct, receiverKyberPriv);
    const ecdhSecret = secp.getSharedSecret(receiverECDHPriv, senderECDHPub, true).slice(1);
    const sessionKey = sha256(new Uint8Array([...pqcSharedSecret, ...ecdhSecret]));
    return { sessionKey };
}
