import { ICONS } from "@constants/icons";

export interface MessageInterface {
  id: number,
  date: Date;
  isMe: boolean;
  content: string;
  author_id: number,
  chat_id: number,
  seen?: Date,
  reply_to?: MessageInterface,
}

export interface Position { top: number; left: number; width: number };

export interface Chat {
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  id: number;
  recipient: {
    username: string;
    avatar: string
  };
}

export interface Option {
  icon?: keyof typeof ICONS;
  label?: string;
  action?: any;
  color?: string;
  separator?: boolean
}