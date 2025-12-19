import { useState, useEffect, useContext, createContext } from "react";
import { useWebSocket } from "./WebSocketContext";
import getChats from "../lib/chats/getChats";
import setChatKeysToStorage from "@lib/setChatKeysToStorage";
import generateKeys from "@lib/skid/generateKeys";
import useStorageStore from "@stores/storage";
import addKeysToDump from "@api/lib/keys/addKeysToDump";

const ChatsContext = createContext(null);

export default function ChatsProvider({ children }) {
    // chats variable
    const [chats, setChats] = useState([]);
    // websocket context
    const ws = useWebSocket();
    // storages
    const { mmkv, realm } = useStorageStore();

    function safeObject(obj) {
        if (!obj) return;
        return JSON.parse(JSON.stringify(obj));
    }

    async function sort(chats) {
        const enrichedChats = await Promise.all(
            chats?.map(async chat => {
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
                try {
                     // get chats from api
                const _chats = await getChats(ws);
                if (_chats) setChats(await sort(_chats));
                } catch (error) {
                    console.log(error)
                }
               
            })();

            // websocket message listener
            ws.addEventListener("message", async (msg) => {
                try {
                    // parse socket message
                    let message;
                    try {
                        message = JSON.parse(msg?.data);
                    } catch (error) {
                        return;
                    }

                    // if someone from chat changed keys change them in mmkv storage
                    if (message?.type === "keys_added") {
                        await setChatKeysToStorage(message?.chat_id, {
                            kyberPublicKey: message?.kyberPublicKey,
                            ecdhPublicKey: message?.ecdhPublicKey,
                            edPublicKey: message?.edPublicKey
                        });
                    } else if (message?.chat) { // chat created socket
                        // parse chats from mmkv storage
                        let _chats;
                        try {
                            _chats = JSON.parse(mmkv.getString("chats"));
                        } catch {
                            _chats = [];
                        }

                        // generate current user encryption keys
                        const myKeys = generateKeys();

                        // send current user public keys
                        ws.send(JSON.stringify({
                            type: "add_keys",
                            chat_id: message?.chat?.id,
                            kyberPublicKey: myKeys.kyberPublicKey,
                            ecdhPublicKey: myKeys.ecdhPublicKey,
                            edPublicKey: myKeys.edPublicKey
                        }));

                        // add chat to mmkv storage
                        _chats = [..._chats, {
                            id: message?.chat?.id,
                            key: message?.chat?.encryption_key,
                            keys: {
                                my: { ...myKeys },
                                recipient: {}
                            }
                        }];

                        // send dump
                        addKeysToDump(mmkv, { chat_id: message?.chat?.id, ...myKeys })

                        // save changes
                        mmkv.set("chats", JSON.stringify(_chats));

                        // add new chat to chats var
                        setChats(prev => {
                            const next = [...prev, message.chat];
                            sort(next).then(sorted => setChats(sorted));
                            return next;
                        });
                    }
                } catch { }
            });
        }
    }, [ws]);

    useEffect(() => {
        let listeners = [];

        (async () => {
            chats.forEach(chat => {
                // get all chat messages
                const messages = realm.objects("Message").filtered("chat_id == $0", chat.id);

                // realm listener
                const listener = (collection, changes) => {
                    if (changes.insertions.length > 0) {
                        // change chat last message if last message changed in local realm storage
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

                // init listener
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
