import initRealm from "@lib/initRealm";
import Realm from "realm";
import { useState, useEffect, useContext, createContext } from "react";
import { useWebSocket } from "./WebSocketContext";
import getChatFromStorage from "@lib/getChatFromStorage";
import decrypt from "@lib/skid/decrypt";

const MessagesContext = createContext(null);

export default function MessagesProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const ws = useWebSocket();

    useEffect(() => {
        if (ws) {
            ws.addEventListener("message", async (msg) => {
                const realm = await initRealm();

                let message;
                try {
                    message = JSON.parse(msg?.data);
                } catch (error) {
                    console.log(error);
                    return;
                }
                
                if (message?.type === "message") {
                    try {
                        const chat = await getChatFromStorage(message?.chat_id);

                        if (!chat) return

                        const myKeys = chat?.keys?.my;
                        const recipientKeys = chat?.keys?.recipient;

                        const decrypted = decrypt(message, myKeys, recipientKeys, false);

                        setMessages(prev => [...prev, { ...decrypted, chat_id: message?.chat_id, id: message?.id }]);
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