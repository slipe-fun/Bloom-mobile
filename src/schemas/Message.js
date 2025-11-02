import Realm from "realm";

export class Message extends Realm.Object {}

Message.schema = {
  name: "Message",
  primaryKey: "id",
  properties: {
    id: "int",
    chat_id: "int",
    content: "string",
    author_id: "int",
    date: "date",
    seen: "date?",
    reply_to: "Message?",
  },
};
