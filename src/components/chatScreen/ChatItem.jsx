import Chat from "@components/chatsScreen/chat";
import formatSentTime from "@lib/formatSentTime";

export default function ChatItem({ item, userId }) {
  const recipient = item.members.find((member) => member?.id !== parseInt(userId));

  return (
    <Chat
      chat={{
        lastMessage: item?.last_message ?
          (userId === item?.last_message?.author_id ? "Вы: " : `${recipient?.username}: `)
            + item?.last_message?.content || "Чат создан" : "Чат создан",
        lastMessageTime: formatSentTime(item?.last_message?.date) || "",
        recipient,
        id: item?.id,
        avatar: "https://i.pinimg.com/736x/e9/83/3b/e9833b429842c971097ab6e9ad3bf6ca.jpg",
        unreadCount: 0,
      }}
    />
  );
}
