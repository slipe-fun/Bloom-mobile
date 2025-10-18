import initRealm from "@lib/initRealm";
import Realm from "realm";
import { useState, useEffect, useContext, createContext } from "react";
import { useWebSocket } from "./WebSocketContext";
import getChatFromStorage from "@lib/getChatFromStorage";
import decrypt from "@lib/skid/decrypt";

const SeenMessagesContext = createContext(null);

export default function SeenMessagesProvider({ children }) {
    const [seenMessages, setSeenMessages] = useState([]);
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

                if (message?.type === "message_seen") {
                    const messages = message?.messages;

                    realm.write(() => {
                        messages?.forEach(message_id => {
                            const msg = realm.objectForPrimaryKey("Message", message_id);
                            if (msg) msg.seen = message?.seen_at;
                        });
                    });

                    setSeenMessages(messages?.map(_message => ({
                        id: _message, date: message?.seen_at, chat_id: message?.chat_id
                    })));
                }
            });
        }
    }, [ws]);

    function clear() {
        setSeenMessages([]);
    }

    return (
        <SeenMessagesContext.Provider value={{ seenMessages, clear }}>
            {children}
        </SeenMessagesContext.Provider>
    )
}

export const useSeenMessagesList = () => useContext(SeenMessagesContext);