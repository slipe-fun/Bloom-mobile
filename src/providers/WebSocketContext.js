import { createSecureStorage } from "@lib/Storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import setChatKeysToStorage from "@lib/setChatKeysToStorage";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const reconnectTimeout = useRef(null);

    const connect = async () => {
        const storage = await createSecureStorage("user-storage");

        const ws = new WebSocket("wss://swiftly.slipe.fun/ws?token=" + storage.getString("token"));

        ws.onopen = () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = null;
            }
        };

        ws.onmessage = async (msg) => {
            let message;
            try {
                message = JSON.parse(msg?.data);
            } catch (error) {
                console.log(error);
                return;
            }

            if (message.type === "keys_added") {
                await setChatKeysToStorage(message?.chat_id, {
                    kyberPublicKey: message?.kyberPublicKey,
                    ecdhPublicKey: message?.ecdhPublicKey,
                    edPublicKey: message?.edPublicKey
                }, message?.user_id);
            }
        }

        ws.onclose = () => {
            reconnectTimeout.current = setTimeout(connect, 3000);
        };

        ws.onerror = (err) => {
            ws.close();
        };

        setSocket(ws);
    };

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            socket?.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);