import axios from "axios";
import { createSecureStorage } from "@lib/Storage";
import { API_URL } from "@constants/Api";

export default async function (chat_id, after_id = 0) {
  try {
    const Storage = await createSecureStorage("user-storage");

    const token = Storage.getString("token");

    const response = await axios.get(`${API_URL}/chat/${chat_id}/messages/after/${after_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err) { console.log(err) }
}
