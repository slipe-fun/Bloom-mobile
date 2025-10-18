import { createSecureStorage } from "@lib/Storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { WEBSOCKET_URL } from "@constants/Api";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const reconnectTimeout = useRef(null);
    const appState = useRef(AppState.currentState);

    const connect = async () => {
        const storage = await createSecureStorage("user-storage");
        const ws = new WebSocket(WEBSOCKET_URL + storage.getString("token"));

        ws.onopen = () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = null;
            }
        };

        ws.onclose = () => {
            if (!reconnectTimeout.current)
                reconnectTimeout.current = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
            ws.close();
        };

        setSocket(ws);
    };

    useEffect(() => {
        connect();

        const subscription = AppState.addEventListener("change", (nextState) => {
            if (
                appState.current.match(/active/) &&
                nextState.match(/inactive|background/)
            ) {
                if (socket) socket.close();
            } else if (
                appState.current.match(/inactive|background/) &&
                nextState === "active"
            ) {
                connect();
            }
            appState.current = nextState;
        });

        return () => {
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            if (socket) socket.close();
            subscription.remove();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
