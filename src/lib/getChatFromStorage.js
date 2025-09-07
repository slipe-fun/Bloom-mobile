import { createSecureStorage } from "@lib/Storage";

export default async function (chat_id) {
    const Storage = await createSecureStorage("user-storage");
    
    let chats;
    try {
        chats = JSON.parse(Storage.getString("chats"));
    } catch {
        return null;
    }

    return chats?.find(chat => chat?.id === chat_id);
}