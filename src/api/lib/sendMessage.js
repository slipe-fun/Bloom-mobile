import getChatFromStorage from "../../lib/getChatFromStorage";
import initRealm from "../../lib/initRealm";
import Realm from "realm";
import decrypt from "../../lib/skid/decrypt";
import encrypt from "../../lib/skid/encrypt";
import { encrypt as sskEncrypt, decrypt as sskDecrypt } from "../../lib/skid/serversideKeyEncryption";
import { createSecureStorage } from "../../lib/Storage";

export default async function (content, chat_id, count, ws) {
    const realm = await initRealm();
    const storage = await createSecureStorage("user-storage");
    const chatData = await getChatFromStorage(chat_id);

    let message;

    if (!chatData?.keys?.recipient?.kyberPublicKey) {
        try {
            const encrypted = sskEncrypt(content, parseInt(storage?.getString("user_id")), chatData?.key);

            ws.send(JSON.stringify({
                type: "send",
                chat_id: chat_id,
                ciphertext: encrypted.ciphertext,
                nonce: encrypted.nonce,
                encryption_type: "server"
            }));

            const listener = async (msg) => {
                try {
                    message = JSON.parse(msg?.data);
                } catch (error) {
                    console.log(error);
                    return;
                }

                if (message?.type === "message") {
                    try {
                        const decrypted = { ...(sskDecrypt(message?.ciphertext, message?.nonce, chatData?.key) || {}), id: message?.id };
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

    const encrypted = encrypt(content, { ...chatData?.keys?.my, id: parseInt(storage.getString("user_id")) }, chatData?.keys?.recipient, count);

    ws.send(JSON.stringify({
        type: "send",
        encryption_type: 'client',
        chat_id: chat_id,
        ...encrypted
    }));

    const listener = async (msg) => {
        try {
            message = JSON.parse(msg?.data);
        } catch (error) {
            console.log(error);
            return;
        }

        if (message?.type === "message") {
            try {
                const decrypted = { ...(decrypt(message, chatData?.keys?.my, chatData?.keys?.my, true) || {}), id: message?.id };
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
