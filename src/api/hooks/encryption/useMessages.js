import { useState, useEffect } from "react";
import { useWebSocket } from "@api/providers/WebSocketContext";
import { useMessagesList } from "@api/providers/MessagesContext";
import sendMessage from "@api/lib/sendMessage";
import Realm from "realm";
import getChatMessages from "src/api/lib/messages/getChatMessages";
import decrypt from "@lib/skid/decrypt";
import { decrypt as sskDecrypt } from "@lib/skid/serversideKeyEncryption";
import getChatFromStorage from "@lib/getChatFromStorage";
import { useSeenMessagesList } from "@api/providers/SeenMessagesContext";
import useStorageStore from "@stores/storage";

function uniqueById(arr) {
    const seen = new Set();
    return arr.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });
}

// sort messages by id function
function mergeAndSort(prev, next) {
    return uniqueById([...prev, ...next])
        .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export default function (chat_id) {
    const [messages, setMessages] = useState([]);

    // socket variables
    const { messages: newMessages, clear: clearNewMessages } = useMessagesList();
    const { seenMessages: newSeenMessages, clear: clearNewSeenMessages } = useSeenMessagesList();
    const ws = useWebSocket();

    // storages

    const { mmkv, realm } = useStorageStore();

    //
    // ENCRYPT AND SEND MESSAGE
    //

    const addMessage = async (content, reply_to) => {
        try {
            // send message socket
            sendMessage(content, reply_to, chat_id, messages?.length, ws).catch(console.log);

            let _reply_to;
            if (reply_to) {
                try {
                    const reply_to_message = realm
                        .objects("Message")
                        .filtered("id == $0", reply_to)[0]

                    if (reply_to_message) {
                        _reply_to = reply_to_message
                    }
                } catch { }
            }

            const reply_to_json = reply_to ? {
                id: _reply_to?.id,
                chat_id,
                content: _reply_to?.content,
                author_id: _reply_to?.author_id || _reply_to?.from_id,
                date: _reply_to?.date,
                seen: _reply_to?.seen
            } : null

            // payload
            const newMsg = {
                id: messages[messages.length - 1]?.id + 1,
                isMe: true,
                isFake: true,
                chat_id,
                content,
                author_id: parseInt(mmkv?.getString("user_id")),
                date: new Date(),
                seen: false,
                reply_to: reply_to_json
            };

            setMessages(prev => mergeAndSort(prev, [newMsg]));
        } catch (error) {
            console.log(error);
        }
    };

    //
    // GET MESSAGES FROM API
    //

    useEffect(() => {
        (async () => {
            // last saved message
            const lastMessage = realm
                .objects("Message")
                .filtered("chat_id == $0", chat_id)
                .sorted("id", true)[0] ?? null;

            // get messages from api sent after last message 
            const messages = await getChatMessages(chat_id, lastMessage?.id || 0);

            // is chat in storage check
            const chat = await getChatFromStorage(chat_id);
            if (!chat) return;

            // kyber, ecdh, ed keys
            const myKeys = chat?.keys?.my;
            const recipientKeys = chat?.keys?.recipient;

            // user id
            const userId = parseInt(mmkv.getString("user_id"))

            const decryptedMessages = messages.map(message => {
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

                try {
                    // if kyber message sent by recipient then decrypt using both key pairs
                    // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
                    return {
                        ...message?.encapsulated_key ?
                            decrypt(message, myKeys, recipientKeys, false) :
                            sskDecrypt(message?.ciphertext, message?.nonce, chat?.key),
                        chat_id: message?.chat_id,
                        id: message?.id,
                        seen: message?.seen,
                        reply_to: reply_to ? {
                            id: message?.reply_to?.id,
                            chat_id: message?.chat_id,
                            content: reply_to?.content,
                            author_id: reply_to?.author_id || reply_to?.from_id,
                            date: reply_to?.date,
                            seen: message?.reply_to?.seen
                        } : null
                    };
                } catch (error) {
                    // if kyber message sent by user (current session user) decrypt using only his keys
                    if (error.message === "invalid polyval tag") {
                        try {
                            return {
                                ...decrypt(message, myKeys, myKeys, true),
                                chat_id: message?.chat_id,
                                id: message?.id,
                                seen: message?.seen,
                                reply_to: reply_to ? {
                                    id: message?.reply_to?.id,
                                    chat_id: message?.chat_id,
                                    content: reply_to?.content,
                                    author_id: reply_to?.from_id,
                                    date: reply_to?.date,
                                    seen: message?.reply_to?.seen
                                } : null
                            };
                        } catch { }
                    }
                }
            })
                .filter(Boolean)
                .map(message => ({
                    ...message,
                    isMe: message?.from_id === userId
                }));

            setMessages(prev => mergeAndSort(prev, decryptedMessages));

            // write decrypted messages to local storage
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
                            seen: null,
                            reply_to: message?.reply_to
                        },
                        Realm.UpdateMode.Modified
                    );
                });
            });

        })();
    }, [chat_id]);

    //
    // GET MESSAGES FROM LOCAL REALM STORAGE
    //

    useEffect(() => {
        (async () => {
            // get all chat messages
            const realmMessages = realm.objects("Message").filtered("chat_id == $0", chat_id);
            // user id
            const userId = parseInt(mmkv.getString("user_id"));
            // add isMe param to message object
            const newMsgs = realmMessages.map(message => ({
                ...message,
                isMe: message.author_id === userId
            }));

            setMessages(prev => mergeAndSort(prev, newMsgs));
        })();
    }, [chat_id]);

    //
    // GET NEW MESSAGES FROM MESSAGE SOCKET
    //

    useEffect(() => {
        if (!newMessages?.length) return;

        (async () => {
            // user id
            const userId = parseInt(mmkv.getString("user_id"));

            // filter messages by current chat_id
            const filtered = newMessages
                .filter(m =>
                    m.chat_id === chat_id
                    && !(messages?.find(_message => _message?.content === m?.content && _message?.isFake)))
                .map(m => ({
                    ...m,
                    isMe: m.from_id === userId,
                }));

            if (filtered.length > 0) {
                setMessages(prev => mergeAndSort(prev, filtered));
            }

            // clear context messages history
            clearNewMessages();
        })();
    }, [newMessages, chat_id]);

    //
    // GET CHANGES OF SEEN MESSAGES STATUS
    //

    useEffect(() => {
        if (!newSeenMessages.length) return;

        // filter seen messages ids by current chat_id
        const filtered = newSeenMessages.filter(m => m?.chat_id === chat_id);

        if (filtered?.length > 0) {
            setMessages(prev => prev.map(m => {
                // change only that messages that is in filtered list
                if (filtered?.find(_m => _m?.id === m?.id)) {
                    return { ...m, seen: m?.date }
                }
                return m;
            }))
        }

        clearNewSeenMessages()
    }, [newSeenMessages, chat_id]);

    //
    // SEND SEEN SOCKET
    //

    useEffect(() => {
        (async function () {
            try {
                const lastMessage = messages[messages?.length - 1];

                // if message not seen and message sent by recipient
                if (!lastMessage?.seen && !lastMessage?.isMe) {
                    // send seen socket
                    ws.send(JSON.stringify({
                        type: "message_seen", chat_id, messages: [lastMessage?.id]
                    }))

                    // change seen status in local storage
                    realm.write(() => {
                        const msg = realm.objectForPrimaryKey("Message", lastMessage?.id);
                        if (msg) msg.seen = new Date();
                    })

                    setMessages(prev => prev?.map(message => {
                        // change only last message status
                        if (message?.id === lastMessage?.id) {
                            return { ...message, seen: new Date() }
                        }
                        return message;
                    }))
                }

                // get last unseen message from local storage
                const lastUnseenMessage = [...messages].reverse().find(m => !m.seen && !m.isMe);
                if (!lastUnseenMessage) return;

                // send seen socket for last unseen message
                ws.send(JSON.stringify({
                    type: "message_seen", chat_id, messages: [lastUnseenMessage?.id]
                }))

                // change last unseen message status in local storage
                realm.write(() => {
                    const msg = realm.objectForPrimaryKey("Message", lastUnseenMessage?.id);
                    if (msg) msg.seen = new Date();
                })

                setMessages(prev => prev?.map(message => {
                    // change only last unseen message status
                    if (message?.id === lastUnseenMessage?.id) {
                        return { ...message, seen: new Date() }
                    }
                    return message;
                }))
            } catch { }
        }())
    }, [messages]);

    return { messages: messages, addMessage };
}
