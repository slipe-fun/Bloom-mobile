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
      const recipient = chat?.members?.find(member => member?.id !== parseInt(Storage.getString("user_id")));
      const me = chat?.members?.find(member => member?.id === parseInt(Storage.getString("user_id")))

      let myKeys;
      if (me?.kyberPublicKey?.length === 0) {
        myKeys = generateKeys();
        
        ws.send(JSON.stringify({
          type: "add_keys",
          chat_id: chat?.id,
          kyberPublicKey: myKeys.kyberPublicKey,
          ecdhPublicKey: myKeys.ecdhPublicKey,
          edPublicKey: myKeys.edPublicKey
        }))        
      }

      chats = [...chats, {
        id: chat?.id,
        keys: {
          my: {...(myKeys || me)},
          recipient: {...recipient}
        }
      }];
    })
    Storage.set("chats", JSON.stringify(chats))

    return response.data;    
  } catch (err) {console.log(err)}
}
