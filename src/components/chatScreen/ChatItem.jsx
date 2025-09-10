import Chat from "@components/chatsScreen/chat";

export default function ChatItem({ item, userId }) {
  const recipient = item.members.find((member) => member?.id !== parseInt(userId));

  return (
    <Chat
      chat={{
        lastMessage: "Последнее сообщение",
        lastMessageTime: "12:34",
        recipient,
        id: item?.id,
        avatar: "https://i.pinimg.com/736x/e9/83/3b/e9833b429842c971097ab6e9ad3bf6ca.jpg",
        unreadCount: item.id % 3,
      }}
    />
  );
}
