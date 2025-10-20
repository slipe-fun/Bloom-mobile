export interface MessageInterface {
	isMe: Boolean;
	content: String;
	date: Date;
  id: Number,
}

export interface Chat {
  unreadCount: Number;
  lastMessage: String;
  lastMessageTime: String;
  id: Number;
  recipient: {
    username: String;
    avatar: String
  };
}