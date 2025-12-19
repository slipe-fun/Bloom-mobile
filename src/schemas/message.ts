import type { Message as MessageType } from "@interfaces";
import Realm from "realm";

export class Message extends Realm.Object<Message> implements MessageType {
  id!: number;
  chat_id!: number;
  content!: string;
  author_id!: number;
  date!: Date;
  seen?: Date;
  nonce?: string;
  reply_to?: Message;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "id",
    properties: {
      id: "int",
      chat_id: "int",
      content: "string",
      author_id: "int",
      date: "date",
      seen: "date?",
      nonce: "string?",
      reply_to: "Message?",
    },
  };
}
