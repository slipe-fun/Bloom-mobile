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

                // get chat from mmkv storage
                const chat = await getChatFromStorage(message?.chat_id);

                if (!chat) return

                // get current user chat keys
                const myKeys = chat?.keys?.my;
                // get recipient chat keys
                const recipientKeys = chat?.keys?.recipient;
                // get general chat key
                const key = chat?.key;

                let reply_to;
                if (message?.reply_to) {
                    try {
                        const reply_to_message = realm
                            .objects("Message")
                            .filtered("id == $0", message?.reply_to?.id)[0]

                        if (reply_to_message) {
                            reply_to = reply_to_message
                        }

                        reply_to = message?.encapsulated_key ?
                            decrypt(message?.reply_to, myKeys, recipientKeys, false) :
                            sskDecrypt(message?.reply_to?.ciphertext, message?.reply_to?.nonce, key);
                    } catch { }
                }

                const reply_to_json = reply_to ? {
                    id: message?.reply_to?.id,
                    chat_id: message?.chat_id,
                    content: reply_to?.content,
                    author_id: reply_to?.author_id || reply_to?.from_id,
                    date: reply_to?.date,
                    seen: message?.reply_to?.seen
                } : null

                // if socket type is message
                if (message?.type === "message") {
                    try {
                        //
                        // IF SOFT SKID ENCRYPTION TYPE
                        //

                        if (message?.encryption_type === "server") {
                            // decrypt message by general chat key
                            const decrypted = sskDecrypt(message?.ciphertext, message?.nonce, key);

                            // add decrypted message to messages var
                            setMessages(prev => [...prev, {
                                ...decrypted,
                                chat_id: message?.chat_id,
                                id: message?.id,
                                reply_to: reply_to_json
                            }]);

                            // add decrypted message to local storage
                            realm.write(() => {
                                realm.create("Message", {
                                    id: message?.id,
                                    chat_id: message?.chat_id,
                                    content: decrypted?.content,
                                    author_id: decrypted?.from_id,
                                    date: new Date(),
                                    seen: null,
                                    reply_to: reply_to_json
                                }, Realm.UpdateMode.Modified);
                            });

                            return
                        }

                        //
                        // IF HEAVY SKID ENCRYPTION TYPE
                        // 

                        // decrypt message by current user and recipient keys
                        let decrypted;

                        try {
                            // if kyber message sent by recipient then decrypt using both key pairs
                            // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
                            decrypted = {
                                ...decrypt(message, myKeys, recipientKeys, false),
                                chat_id: message?.chat_id,
                                id: message?.id,
                                reply_to: reply_to_json
                            };
                        } catch (error) {
                            // if kyber message sent by user (current session user) decrypt using only his keys
                            if (error.message === "invalid polyval tag") {
                                try {
                                    decrypted = {
                                        ...decrypt(message, myKeys, myKeys, true),
                                        chat_id: message?.chat_id,
                                        id: message?.id,
                                        reply_to: reply_to_json
                                    };
                                } catch { }
                            }
                        }

                        // add decrypted message to messages var
                        setMessages(prev => [...prev, decrypted]);

                        // add decrypted message to local storage
                        realm.write(() => {
                            realm.create("Message", {
                                id: message?.id,
                                chat_id: message?.chat_id,
                                content: decrypted?.content,
                                author_id: decrypted?.from_id,
                                date: new Date(),
                                seen: null,
                                reply_to: reply_to_json
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