import axios from "axios";
import { createSecureStorage } from "@lib/Storage";
import { API_URL } from "@constants/Api";
import generateKeys from "@lib/skid/generateKeys";
import getChatFromStorage from "@lib/getChatFromStorage";

export default async function getChats(ws) {
  try {
    // mmkv storage
    const Storage = await createSecureStorage("user-storage");

    // get user token from mmkv storage
    const token = Storage.getString("token");

    // send get chats api request
    const response = await axios.get(`${API_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // parse chats from mmkv storage
    let chats;
    try {
      chats = JSON.parse(Storage.getString("chats"))
    } catch {
      chats = []
    }

    // response chats map
    await Promise.all(response?.data?.map(async chat => {
      // get recipient from chat api object
      const recipient = chat?.members?.find(member => member?.id !== parseInt(Storage.getString("user_id")));
      // get current user from chat api object
      const me = chat?.members?.find(member => member?.id === parseInt(Storage.getString("user_id")))
      
      // get chat from mmkv storage
      const chatInStorage = await getChatFromStorage(chat?.id);

      // current user keys variable
      var myKeys;

      // generate keys if current user dont have its
      if (!chatInStorage?.keys?.my?.kyberSecretKey || 
          chatInStorage?.keys?.my?.kyberPublicKey !== me?.kyberPublicKey) {
        myKeys = generateKeys();

        // send new public keys to recipient
        ws.send(JSON.stringify({
          type: "add_keys",
          chat_id: chat?.id,
          kyberPublicKey: myKeys.kyberPublicKey,
          ecdhPublicKey: myKeys.ecdhPublicKey,
          edPublicKey: myKeys.edPublicKey
        }))
      }

      // find chat from mmkv storage (wtf i need to use chat variable mb??idk)
      // TODO: replace _chat with chat
      const _chat = chats?.find(_chat => _chat?.id === chat?.id)
      // if chat exists in mmkv storage
      if (_chat) {
        // find chat index
        const chatIndex = chats?.findIndex(_chat => _chat?.id === chat?.id);
        if (chatIndex !== -1) {
          // add or change chat keys and data in mmkv storage
          // PS: if recipient keys changed in api they will be changed in mmkv storage too because this code
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
        // IF CHAT IS NOT EXISTS IN MMKV STORAGE
        // add chat to storage
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

    // set new chats
    Storage.set("chats", JSON.stringify(chats))

    // return api response
    return response.data;
  } catch (err) { console.log(err) }
}
