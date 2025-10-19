import getChatFromStorage from "../../lib/getChatFromStorage";
import initRealm from "../../lib/initRealm";
import Realm from "realm";
import decrypt from "../../lib/skid/decrypt";
import encrypt from "../../lib/skid/encrypt";
import { encrypt as sskEncrypt, decrypt as sskDecrypt } from "../../lib/skid/serversideKeyEncryption";
import { createSecureStorage } from "../../lib/Storage";

export default async function (content, chat_id, count, ws) {
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
                encryption_type: "server"
            }));

            // TODO: REMOVE THIS CODE BLOCK BCZ ITS ALREADY REALISED IN MESSAGE CONTEXT
            // websocket listener
            const listener = async (msg) => {
                // parse websocket message
                try {
                    message = JSON.parse(msg?.data);
                } catch (error) {
                    console.log(error);
                    return;
                }

                // if socket type is message
                if (message?.type === "message") {
                    try {
                        // decrypt using ssk
                        const decrypted = { ...(sskDecrypt(message?.ciphertext, message?.nonce, chatData?.key) || {}), id: message?.id };
                        
                        // write decrypted message to local storage
                        realm.write(() => {
                            realm.create("Message", {
                                id: message?.id,
                                chat_id: message?.chat_id,
                                content: decrypted?.content,
                                author_id: parseInt(decrypted?.from_id),
                                date: new Date(),
                                seen: null,
                            }, Realm.UpdateMode.Modified);
                        });
                        ws.removeEventListener("message", listener);
                    } catch (error) {
                        console.log(error)
                    }

                }
            };

            ws.addEventListener("message", listener)

            return
        } catch (error) {
            console.log(error)
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
        ...encrypted
    }));

    // websocket listener
    const listener = async (msg) => {
        // parse socket message
        try {
            message = JSON.parse(msg?.data);
        } catch (error) {
            console.log(error);
            return;
        }

        // is socket type is message
        if (message?.type === "message") {
            try {
                // decrypt message using only current user keys
                const decrypted = { ...(decrypt(message, chatData?.keys?.my, chatData?.keys?.my, true) || {}), id: message?.id };

                // write decrypted message to local storage
                realm.write(() => {
                    realm.create("Message", {
                        id: message?.id,
                        chat_id: message?.chat_id,
                        content: decrypted?.content,
                        author_id: parseInt(decrypted?.from_id),
                        date: new Date(),
                        seen: null,
                    }, Realm.UpdateMode.Modified);
                });
                ws.removeEventListener("message", listener);
            } catch (error) {
                console.log(error)
            }

        }
    };

    ws.addEventListener("message", listener)
}
