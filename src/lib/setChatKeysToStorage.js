import { createSecureStorage } from "@lib/Storage";

export default async function (chat_id, keys) {
    const Storage = await createSecureStorage("user-storage");
    
    let chats;
    try {
        chats = JSON.parse(Storage.getString("chats"));
    } catch {
        return null;
    }

    const chat = chats?.find(chat => chat?.id === chat_id);

    chats = [...chats?.filter(_chat => _chat?.id !== chat_id), {
        ...chat,
        keys: {
            my: {...chat?.keys?.my},
            recipient: {...keys}
        }
    }]

    return Storage.set("chats", JSON.stringify(chats))
}