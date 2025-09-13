import { hybridEncrypt } from "./modules/crypto/hybrid/hybrid";
import base64ToUint8Array from "./modules/utils/base64ToUint8Array";
import deriveAesKey from "./modules/crypto/aes/deriveAesKey";

import { randomBytes } from '@noble/hashes/utils';
import encryptCekWithKek from "./modules/crypto/aes/encryptCekWithKek";
import generateIV from "./modules/crypto/utils/generateIV";
import generatePadding from "./modules/crypto/utils/generatePadding";
import encryptMessage from "./modules/crypto/aes/encryptMessage";
import bytesToBase64 from "./modules/utils/bytesToBase64";
import signPayload from "./modules/crypto/ed/signPayload";

export default function encrypt(content, sender, receiver, counter) {
    try {
        const { sessionKey: ssReceiver, cipherText: ctReceiver } = hybridEncrypt(
            base64ToUint8Array(receiver.ecdhPublicKey),
            base64ToUint8Array(receiver.kyberPublicKey),
            base64ToUint8Array(sender.ecdhSecretKey)
        );

        const cekRaw = randomBytes(32);

        const wrapSaltReceiver = randomBytes(32);
        const wrapIvReceiver = randomBytes(12);
        const kekReceiver = deriveAesKey(ssReceiver, wrapSaltReceiver);
        const wrappedCekReceiver = encryptCekWithKek(kekReceiver, wrapIvReceiver, cekRaw);

        const { sessionKey: ssSender, cipherText: ctSender } = hybridEncrypt(
            base64ToUint8Array(sender.ecdhPublicKey),
            base64ToUint8Array(sender.kyberPublicKey),
            base64ToUint8Array(sender.ecdhSecretKey)
        );

        const wrapSaltSender = randomBytes(32);
        const wrapIvSender = randomBytes(12);
        const kekSender = deriveAesKey(ssSender, wrapSaltSender);
        const wrappedCekSender = encryptCekWithKek(kekSender, wrapIvSender, cekRaw);

        const iv = generateIV(counter);
        const message = {
            content,
            from_id: sender?.id || "unknown",
            date: new Date().toISOString(),
            padding: generatePadding(),
        };
        const ciphertext = encryptMessage(cekRaw, iv, message);

        const toSign = {
            ciphertext: bytesToBase64(ciphertext),
            nonce: bytesToBase64(iv),
            encapsulated_key: bytesToBase64(ctReceiver),
            cek_wrap: bytesToBase64(wrappedCekReceiver),
            cek_wrap_iv: bytesToBase64(wrapIvReceiver),
            cek_wrap_salt: bytesToBase64(wrapSaltReceiver),
            encapsulated_key_sender: bytesToBase64(ctSender),
            cek_wrap_sender: bytesToBase64(wrappedCekSender),
            cek_wrap_sender_iv: bytesToBase64(wrapIvSender),
            cek_wrap_sender_salt: bytesToBase64(wrapSaltSender),
        };

        const signature = signPayload(base64ToUint8Array(sender.edSecretKey), toSign);

        return {
            ...toSign,
            signed_payload: JSON.stringify(toSign, null, 2),
            signature
        }
    } catch (error) {
        console.log(error)
    }
}
