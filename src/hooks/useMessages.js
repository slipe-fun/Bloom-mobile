import { useState, useEffect } from "react";
import { useWebSocket } from "@providers/WebSocketContext";
import { useMessagesList } from "@providers/MessagesContext";
import sendMessage from "@lib/sendMessage";
import { createSecureStorage } from "@lib/Storage";
import initRealm from "@lib/initRealm";
import Realm from "realm";
import getChatMessages from "@lib/api/messages/getChatMessages";
import decrypt from "@lib/skid/decrypt";
import getChatFromStorage from "@lib/getChatFromStorage";
import { useSeenMessagesList } from "@providers/SeenMessagesContext";

function uniqueById(arr) {
    const seen = new Set();
    return arr.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });
}

function mergeAndSort(prev, next) {
    return uniqueById([...prev, ...next])
        .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export default function useChatMessages(chat_id) {
    const [messages, setMessages] = useState([]);
    const { messages: newMessages, clear: clearNewMessages } = useMessagesList();
    const { seenMessages: newSeenMessages, clear: clearNewSeenMessages } = useSeenMessagesList();
    const ws = useWebSocket();

    const addMessage = async (content) => {
        try {
            const storage = await createSecureStorage("user-storage");
            await sendMessage(content, chat_id, messages?.length, ws).catch(console.log);

            const newMsg = {
                id: messages[messages.length - 1]?.id + 1,
                isMe: true,
                chat_id,
                content,
                author_id: parseInt(storage?.getString("user_id")),
                date: new Date(),
                seen: false
            };

            setMessages(prev => mergeAndSort(prev, [newMsg]));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            const storage = await createSecureStorage("user-storage");
            const realm = await initRealm();

            const lastMessage = realm
                .objects("Message")
                .filtered("chat_id == $0", chat_id)
                .sorted("id", true)[0] ?? null;

            const messages = await getChatMessages(chat_id, lastMessage?.id);

            const chat = await getChatFromStorage(chat_id);
            if (!chat) return;

            const myKeys = chat?.keys?.my;
            const recipientKeys = chat?.keys?.recipient;

            const decryptedMessages = messages.map(message => {
                try {
                    return {
                        ...decrypt(message, myKeys, recipientKeys, false),
                        chat_id: message?.chat_id,
                        id: message?.id,
                    };
                } catch (error) {
                    if (error.message === "invalid polyval tag") {
                        try {
                            return {
                                ...decrypt(message, myKeys, myKeys, true),
                                chat_id: message?.chat_id,
                                id: message?.id,
                            };
                        } catch { }
                    }
                }
            })
                .map(message => ({
                    ...message,
                    isMe: message.from_id === parseInt(storage.getString("user_id"))
                }))
                .filter(Boolean);

            setMessages(prev => mergeAndSort(prev, decryptedMessages));

            realm.write(() => {
                decryptedMessages.forEach(message => {
                    realm.create(
                        "Message",
                        {
                            id: message?.id,
                            chat_id: message?.chat_id,
                            content: message?.content,
                            author_id: message?.from_id,
                            date: new Date(message?.date),
                            seen: new Date(),
                        },
                        Realm.UpdateMode.Modified
                    );
                });
            });

        })();
    }, [chat_id]);

    useEffect(() => {
        (async () => {
            const storage = await createSecureStorage("user-storage");
            const realm = await initRealm();

            const realmMessages = realm.objects("Message").filtered("chat_id == $0", chat_id);

            const newMsgs = realmMessages.map(message => ({
                ...message,
                isMe: message.author_id === parseInt(storage.getString("user_id"))
            }));

            setMessages(prev => mergeAndSort(prev, newMsgs));
        })();
    }, [chat_id]);

    useEffect(() => {
        if (!newMessages?.length) return;

        (async () => {
            const storage = await createSecureStorage("user-storage");

            const filtered = newMessages
                .filter(m => m.chat_id === chat_id)
                .map(m => ({
                    ...m,
                    isMe: m.from_id === parseInt(storage.getString("user_id")),
                }));

            if (filtered.length > 0) {
                setMessages(prev => mergeAndSort(prev, filtered));
            }

            clearNewMessages();
        })();
    }, [newMessages, chat_id]);

    useEffect(() => {
        if (!newSeenMessages.length) return;

        const filtered = newSeenMessages.filter(m => m?.chat_id === chat_id);

        if (filtered?.length > 0) {
            setMessages(prev => prev.map(m => {
                if (filtered?.find(_m => _m?.id === m?.id)) {
                    return { ...m, seen: m?.date }
                }
                return m;
            }))
        }

        clearNewSeenMessages()
    }, [newSeenMessages, chat_id]);

    useEffect(() => {
        (async function () {
            try {
            const realm = await initRealm();

            const lastMessage = messages[messages?.length - 1];

            if (!lastMessage?.seen && !lastMessage?.isMe) {
                ws.send(JSON.stringify({
                    chat_id, messages: [lastMessage?.id]
                }))

                realm.write(() => {
                    const msg = realm.objectForPrimaryKey("Message", lastMessage?.id);
                    if (msg) msg.seen = new Date();
                })

                setMessages(prev => prev?.map(message => {
                    if (message?.id === lastMessage?.id) {
                        return { ...message, seen: new Date() }
                    }
                    return message;
                }))
            }

            const lastUnseenMessage = [...messages].reverse().find(m => !m.seen && !m.isMe);
            if (!lastUnseenMessage) return;

            ws.send(JSON.stringify({
                chat_id, messages: [lastUnseenMessage?.id]
            }))

            realm.write(() => {
                const msg = realm.objectForPrimaryKey("Message", lastUnseenMessage?.id);
                if (msg) msg.seen = new Date();
            })

            setMessages(prev => prev?.map(message => {
                if (message?.id === lastUnseenMessage?.id) {
                    return { ...message, seen: new Date() }
                }
                return message;
            }))
        } catch {}
        }())
    }, [messages]);

    useEffect(() => {
        setMessages([]);
    }, [chat_id])

    return { messages: messages, addMessage };
}
