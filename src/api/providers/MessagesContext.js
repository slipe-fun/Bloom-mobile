import initRealm from "@lib/initRealm";
import Realm from "realm";
import { useState, useEffect, useContext, createContext } from "react";
import { useWebSocket } from "./WebSocketContext";
import getChatFromStorage from "@lib/getChatFromStorage";
import decrypt from "@lib/skid/decrypt";
import { decrypt as sskDecrypt } from "@lib/skid/serversideKeyEncryption";

const MessagesContext = createContext(null);

export default function MessagesProvider({ children }) {
    // messages variable
    const [messages, setMessages] = useState([]);
    // websocket context
    const ws = useWebSocket();

    useEffect(() => {
        if (ws) {
            // websocket socket listener
            ws.addEventListener("message", async (msg) => {
                // local storage init
                const realm = await initRealm();

                // parse socket
                let message;
                try {
                    message = JSON.parse(msg?.data);
                } catch (error) {
                    console.log(error);
                    return;
                }

                // if socket type is message
                if (message?.type === "message") {
                    try {
                        // get chat from mmkv storage
                        const chat = await getChatFromStorage(message?.chat_id);

                        if (!chat) return

                        //
                        // IF SOFT SKID ENCRYPTION TYPE
                        //

                        if (message?.encryption_type === "server") {
                            // get general chat key
                            const key = chat?.key;

                            // decrypt message by general chat key
                            const decrypted = sskDecrypt(message?.ciphertext, message?.nonce, key);

                            // add decrypted message to messages var
                            setMessages(prev => [...prev, { ...decrypted, chat_id: message?.chat_id, id: message?.id }]);

                            // add decrypted message to local storage
                            realm.write(() => {
                                realm.create("Message", {
                                    id: message?.id,
                                    chat_id: message?.chat_id,
                                    content: decrypted?.content,
                                    author_id: decrypted?.from_id,
                                    date: new Date(),
                                    seen: null,
                                }, Realm.UpdateMode.Modified);
                            });

                            return
                        }

                        //
                        // IF HEAVY SKID ENCRYPTION TYPE
                        // 

                        // get current user chat keys
                        const myKeys = chat?.keys?.my;
                        // get recipient chat keys
                        const recipientKeys = chat?.keys?.recipient;

                        // decrypt message by current user and recipient keys
                        const decrypted = decrypt(message, myKeys, recipientKeys, false);

                        // add decrypted message to messages var
                        setMessages(prev => [...prev, { ...decrypted, chat_id: message?.chat_id, id: message?.id }]);
                        
                        // add decrypted message to local storage
                        realm.write(() => {
                            realm.create("Message", {
                                id: message?.id,
                                chat_id: message?.chat_id,
                                content: decrypted?.content,
                                author_id: decrypted?.from_id,
                                date: new Date(),
                                seen: null,
                            }, Realm.UpdateMode.Modified);
                        });
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
        }
    }, [ws]);

    // clear messages history
    function clear() {
        setMessages([]);
    }

    return (
        <MessagesContext.Provider value={{ messages, clear }}>
            {children}
        </MessagesContext.Provider>
    )
}

export const useMessagesList = () => useContext(MessagesContext);