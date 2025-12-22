import { ICONS } from "@constants/icons";

interface ChatLastMessage {
  content?: string;
  date?: Date;
}

interface ChatLastMessageView extends ChatLastMessage {
  time?: string;
}

export interface Message {
  id: number;
  date: Date;
  isMe?: boolean;
  content: string;
  author_id: number;
  chat_id: number;
  seen?: Date;
  nonce?: string;
  reply_to?: Message;
  type?: string;
}

export interface Chat {
  unreadCount?: number;
  last_message?: ChatLastMessage;
  members?: Member[];
  avatar?: string;
  id?: number;
  recipient?: Member;
}

export interface ChatView extends Chat {
  lastMessage?: ChatLastMessageView;
}

export interface Position { top: number; left: number; width: number };

export interface Option {
  icon?: keyof typeof ICONS;
  label?: string;
  action?: (payload?: string) => void;
  color?: string;
  separator?: boolean
}

export interface Member {
  display_name?: string | null;
  id: number;
  username: string;
  avatar: string;
}

export interface SearchUser { date: Date; display_name: string | null; id: number; username: string | null; avatar: string; }