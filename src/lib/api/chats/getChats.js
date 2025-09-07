import axios from "axios";
import { createSecureStorage } from "@lib/Storage";
import { API_URL } from "@constants/Api";
import generateKeys from "@lib/skid/generateKeys";

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
    response?.data?.map(chat => {
      if (chats.find(_chat => _chat?.id === chat?.id)) return
      const myKeys = generateKeys();
      
      ws.send(JSON.stringify({
        type: "add_keys",
        chat_id: chat?.id,
        kyberPublicKey: myKeys.kyberPublicKey,
        ecdhPublicKey: myKeys.ecdhPublicKey,
        edPublicKey: myKeys.edPublicKey
      }))

      chats = [...chats, {
        id: chat?.id,
        keys: {
          my: {...myKeys},
          recipient: {...chat?.members?.find(member => member?.id !== Storage.getString("user_id"))}
        }
      }];
    })
    Storage.set("chats", JSON.stringify(chats))

    return response.data;    
  } catch (err) {console.log(err)}
}
