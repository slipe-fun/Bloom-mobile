import getChatFromStorage from "../../lib/getChatFromStorage";
import initRealm from "../../lib/initRealm";
import Realm from "realm";
import decrypt from "../../lib/skid/decrypt";
import encrypt from "../../lib/skid/encrypt";
import { encrypt as sskEncrypt, decrypt as sskDecrypt } from "../../lib/skid/serversideKeyEncryption";
import { createSecureStorage } from "../../lib/storage";

export default async function (content, reply_to, chat_id, count, ws) {
    try {
        // local storage
        const realm = await initRealm();
        // mmkv storage
        const storage = await createSecureStorage("user-storage");
        // get chat from mmkv storage
        const chatData = await getChatFromStorage(chat_id);

        let message;

        // if recipient dont assigned keys use skid soft mode
        if (!chatData?.keys?.recipient?.kyberPublicKey) {
            try {
                // skid soft mode (or serversidekey = ssk) encryption
                // need message content, current user id, chat key
                const encrypted = sskEncrypt(content, parseInt(storage?.getString("user_id")), chatData?.key);

                // send message socket
                ws.send(JSON.stringify({
                    type: "send",
                    chat_id: chat_id,
                    ciphertext: encrypted.ciphertext,
                    nonce: encrypted.nonce,
                    reply_to,
                    encryption_type: "server"
                }));

                return
            } catch (error) {
                return
            }
        }

        // IF HEAVY SKID ENCRYPTION TYPE
        // encrypt message
        const encrypted = encrypt(content, { ...chatData?.keys?.my, id: parseInt(storage.getString("user_id")) }, chatData?.keys?.recipient, count);

        // send encrypted message socket
        ws.send(JSON.stringify({
            type: "send",
            encryption_type: 'client',
            chat_id: chat_id,
            reply_to,
            ...encrypted
        }));

        return
    } catch {
    }
}
