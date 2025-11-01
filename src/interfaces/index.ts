import { ICONS } from "@constants/icons";

export interface MessageInterface {
	isMe: boolean;
	content: string;
	date: Date;
  id: number,
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