import axios from "axios";
import { createSecureStorage } from "@lib/Storage";
import { API_URL } from "@constants/Api";
import generateKeys from "@lib/skid/generateKeys";
import getChatFromStorage from "@lib/getChatFromStorage";

export default async function getChats(ws) {
  try {
    const Storage = await createSecureStorage("user-storage");

    const token = Storage.getString("token");

    const response = await axios.get(`${API_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let chats;
    try {
      chats = JSON.parse(Storage.getString("chats"))
    } catch {
      chats = []
    }
    await Promise.all(response?.data?.map(async chat => {
      const recipient = chat?.members?.find(member => member?.id !== parseInt(Storage.getString("user_id")));
      const me = chat?.members?.find(member => member?.id === parseInt(Storage.getString("user_id")))
      const chatInStorage = await getChatFromStorage(chat?.id);

      var myKeys;
      if (!chatInStorage?.keys?.my?.kyberSecretKey) {
        myKeys = generateKeys();

        ws.send(JSON.stringify({
          type: "add_keys",
          chat_id: chat?.id,
          kyberPublicKey: myKeys.kyberPublicKey,
          ecdhPublicKey: myKeys.ecdhPublicKey,
          edPublicKey: myKeys.edPublicKey
        }))
      }

      const _chat = chats?.find(_chat => _chat?.id === chat?.id)
      if (_chat) {
        const chatIndex = chats?.findIndex(_chat => _chat?.id === chat?.id);
        if (chatIndex !== -1) {
          chats[chatIndex] = {
            id: chat?.id,
            key: chat?.encryption_key,
            keys: {
              my: { ...(myKeys || chatInStorage?.keys?.my || me) },
              recipient: { ...recipient }
            }
          }
        }

      } else {
        chats.push({
          id: chat?.id,
          key: chat?.encryption_key,
          keys: {
            my: { ...(myKeys || chatInStorage?.keys?.my || me) },
            recipient: { ...recipient }
          }
        });
      }
    }))

    Storage.set("chats", JSON.stringify(chats))

    return response.data;
  } catch (err) { console.log(err) }
}
