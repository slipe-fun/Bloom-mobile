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
  unreadCount?: number;
  lastMessage?: string;
  last_message?: { content: string, date: Date };
  lastMessageTime?: string;
  members?: Member[];
  id?: number;
  recipient?: Member;
}

export interface Option {
  icon?: keyof typeof ICONS;
  label?: string;
  action?: any;
  color?: string;
  separator?: boolean
}

export interface SearchUser {
  date: Date;
  display_name: string | null;
  email: null;
  id: number;
  username: string | null;
  avatar: URL;
}

export interface Member {
	id: number;
	username: string;
  avatar: URL;
}