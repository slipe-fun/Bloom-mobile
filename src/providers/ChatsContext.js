import { useState, useEffect, useContext, createContext } from "react";
import { useWebSocket } from "./WebSocketContext";
import { getChats } from "@lib/api";
import setChatKeysToStorage from "@lib/setChatKeysToStorage";
import generateKeys from "@lib/skid/generateKeys";
import { createSecureStorage } from "@lib/Storage";
import initRealm from "@lib/initRealm";

const ChatsContext = createContext(null);

export default function ChatsProvider({ children }) {
    const [chats, setChats] = useState([]);
    const ws = useWebSocket();

    function safeObject(obj) {
        if (!obj) return;
        return JSON.parse(JSON.stringify(obj));
    }

    async function sort(chats) {
        const enrichedChats = await Promise.all(
            chats?.map(async chat => {
                const realm = await initRealm();
                const lastMessage = realm
                    .objects("Message")
                    .filtered("chat_id == $0", chat?.id)
                    .sorted("date", true)[0];

                return {
                    ...chat,
                    last_message: safeObject(lastMessage)
                };
            })
        );

        return enrichedChats.sort((a, b) => {
            const dateA = a.last_message?.date ? new Date(a.last_message.date) : 0;
            const dateB = b.last_message?.date ? new Date(b.last_message.date) : 0;
            return dateB - dateA;
        });
    }

    useEffect(() => {
        if (ws) {
            (async () => {
                const _chats = await getChats(ws);
                if (_chats) setChats(await sort(_chats));
            })();

            ws.addEventListener("message", async (msg) => {
                console.log(msg)
                try {
                    const Storage = await createSecureStorage("user-storage");

                    let message;
                    try {
                        message = JSON.parse(msg?.data);
                    } catch (error) {
                        console.log(error);
                        return;
                    }

                    console.log(message)

                    if (message?.type === "keys_added") {
                        await setChatKeysToStorage(message?.chat_id, {
                            kyberPublicKey: message?.kyberPublicKey,
                            ecdhPublicKey: message?.ecdhPublicKey,
                            edPublicKey: message?.edPublicKey
                        });
                    } else if (message?.chat) {
                        let _chats;
                        try {
                            _chats = JSON.parse(Storage.getString("chats"));
                        } catch {
                            _chats = [];
                        }

                        const myKeys = generateKeys();

                        ws.send(JSON.stringify({
                            type: "add_keys",
                            chat_id: message?.chat?.id,
                            kyberPublicKey: myKeys.kyberPublicKey,
                            ecdhPublicKey: myKeys.ecdhPublicKey,
                            edPublicKey: myKeys.edPublicKey
                        }));

                        _chats = [..._chats, {
                            id: message?.chat?.id,
                            keys: {
                                my: { ...myKeys },
                                recipient: {}
                            }
                        }];

                        Storage.set("chats", JSON.stringify(_chats));

                        setChats(prev => {
                            const next = [...prev, message.chat];
                            sort(next).then(sorted => setChats(sorted));
                            return next;
                        });
                    }
                } catch (error) {
                    console.log(error)
                }
            });
        }
    }, [ws]);

    useEffect(() => {
        let realm;
        let listeners = [];

        (async () => {
            realm = await initRealm();

            chats.forEach(chat => {
                const messages = realm.objects("Message").filtered("chat_id == $0", chat.id);

                const listener = (collection, changes) => {
                    if (changes.insertions.length > 0) {
                        setChats(prev => {
                            const updated = prev.map(c =>
                                c.id === chat.id
                                    ? { ...c, last_message: safeObject(messages.sorted("date", true)[0]) }
                                    : c
                            );

                            sort(updated).then(sorted => {
                                setChats(sorted);
                            });

                            return updated;
                        });
                    }
                };

                messages.addListener(listener);
                listeners.push({ messages, listener });
            });
        })();
    }, [chats]);

    return (
        <ChatsContext.Provider value={chats}>
            {children}
        </ChatsContext.Provider>
    );
};

export const useChatList = () => useContext(ChatsContext);
