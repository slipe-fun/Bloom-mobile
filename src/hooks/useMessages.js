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

function uniqueById(arr) {
    const seen = new Set();
    return arr.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });
}

export default function useChatMessages(chat_id) {
    const [messages, setMessages] = useState([]);
    const newMessages = useMessagesList();
    const ws = useWebSocket();

    // send message func
    const addMessage = async (content) => {
        try {
            const storage = await createSecureStorage("user-storage");
            await sendMessage(content, chat_id, messages?.length, ws).catch(console.log);

            const newMsg = {
                id: String(Date.now()),
                isMe: true,
                chat_id,
                content,
                author_id: parseInt(storage?.getString("user_id")),
                date: new Date(),
                seen: false
            };

            setMessages(prev => [...prev, newMsg]);
        } catch (error) {
            console.log(error);
        }
    };

    // sync messages with server
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

            if (!chat) return

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
            }).map(message => ({ ...message, isMe: message.from_id === parseInt(storage.getString("user_id")) })).filter(Boolean)

            setMessages(prev => [...prev, ...decryptedMessages].sort((a, b) => a.id - b.id))

            realm.write(() => {
                decryptedMessages.forEach(message => {
                    realm.create(
                        "Message",
                        {
                            id: message?.id,
                            chat_id: message?.chat_id,
                            content: message?.content,
                            author_id: message?.from_id,
                            date: new Date(),
                            seen: new Date(),
                        },
                        Realm.UpdateMode.Modified
                    );
                });
            });

        })()
    }, [chat_id])

    // get messages from realm storage
    useEffect(() => {
        (async () => {
            const storage = await createSecureStorage("user-storage");
            const realm = await initRealm();

            const realmMessages = realm.objects("Message").filtered("chat_id == $0", chat_id);

            setMessages(prev => [
                ...prev,
                ...realmMessages
                    .map(message => ({
                        ...message,
                        isMe: message.author_id === parseInt(storage.getString("user_id"))
                    }))
                    .filter(m => !prev.some(pm => pm.id === m.id))
            ]);
        })();
    }, [chat_id]);


    // get messages from socket
    useEffect(() => {
        if (!newMessages?.messages?.length) return;

        (async () => {
            const storage = await createSecureStorage("user-storage");

            const filtered = newMessages.messages
                .filter(m => m.chat_id === chat_id)
                .map(m => ({
                    ...m,
                    isMe: m.from_id === parseInt(storage.getString("user_id")),
                }));

            if (filtered.length > 0) {
                setMessages(prev => [...prev, ...filtered]);
            }

            newMessages.clear();
        })();
    }, [newMessages, chat_id, messages]);

    return { messages: uniqueById(messages), addMessage };
}
