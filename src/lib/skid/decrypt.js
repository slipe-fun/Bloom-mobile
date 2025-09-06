import { hybridDecrypt } from "./modules/crypto/hybrid/hybrid";
import base64ToUint8Array from "./modules/utils/base64ToUint8Array";
import deriveAesKey from "./modules/crypto/aes/deriveAesKey";
import decryptCekWithKek from "./modules/crypto/aes/decryptCekWithKek";
import decryptMessage from "./modules/crypto/aes/decryptMessage";
import verifySignature from "./modules/crypto/ed/verifySignature";

export default async function decrypt(payload, me, sender, isAuthor = false) {
  let cek, iv, ciphertext;

  if (isAuthor) {
    const { sessionKey: ssSender } = hybridDecrypt(
      base64ToUint8Array(sender.ecdhPublicKey),
      base64ToUint8Array(sender.ecdhSecretKey),
      base64ToUint8Array(sender.kyberSecretKey),
      base64ToUint8Array(payload.encapsulated_key_sender)
    );

    const kekSender = deriveAesKey(ssSender, base64ToUint8Array(payload.cek_wrap_sender_salt));
    cek = decryptCekWithKek(
      kekSender,
      base64ToUint8Array(payload.cek_wrap_sender_iv),
      base64ToUint8Array(payload.cek_wrap_sender)
    );
  } else {
    const { sessionKey: ssReceiver } = hybridDecrypt(
      base64ToUint8Array(sender.ecdhPublicKey),
      base64ToUint8Array(me.ecdhSecretKey),
      base64ToUint8Array(me.kyberSecretKey),
      base64ToUint8Array(payload.encapsulated_key)
    );

    const kekReceiver = deriveAesKey(ssReceiver, base64ToUint8Array(payload.cek_wrap_salt));
    cek = decryptCekWithKek(
      kekReceiver,
      base64ToUint8Array(payload.cek_wrap_iv),
      base64ToUint8Array(payload.cek_wrap)
    );
  }

  const signatureValid = verifySignature(base64ToUint8Array(sender.edPublicKey), Object.fromEntries(Object.entries(payload).filter(([k]) => k !== "signature")), payload.signature)
  
  if (!signatureValid) {
    return new Error("Signature is not valid")
  }

  iv = base64ToUint8Array(payload.nonce);
  ciphertext = base64ToUint8Array(payload.ciphertext);

  return decryptMessage(cek, iv, ciphertext);
}
