import React, { useMemo } from "react";
import Chat from "@components/chatsScreen/chat";
import formatSentTime from "@lib/formatSentTime";
import type { Chat as ChatType, ChatView } from "@interfaces";

interface ChatItemProps {
	item: ChatType;
	userId: string | number;
}

export default function ChatItem({ item, userId }: ChatItemProps) {
	const numericUserId = typeof userId === "string" ? parseInt(userId) : userId;

	const recipient = useMemo(() => item.members?.find(member => member.id !== numericUserId), [item, item.members, numericUserId]);

	const lastMessage = useMemo(() => {
		if (!item.last_message) {
			return {
				lastMessage: "Чат создан",
				lastMessageTime: "",
			};
		}

		return {
			content: item.last_message.content || "Чат создан",
			time: formatSentTime(item.last_message.date),
		};
	}, [item.last_message]);

	const chatData = useMemo(
		(): ChatView => ({
			lastMessage,
			recipient,
			id: item.id,
			avatar: "https://i.pinimg.com/736x/e9/83/3b/e9833b429842c971097ab6e9ad3bf6ca.jpg",
			unreadCount: 0,
		}),
		[item.id, lastMessage, recipient]
	);

	return <Chat chat={chatData} />;
}
