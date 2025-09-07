import Header from "@components/chatsScreen/header";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native-unistyles";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue
} from "react-native-reanimated";
import Chat from "@components/chatsScreen/chat";
import useChatsScreenStore from "@stores/ChatsScreen";
import SearchView from "@components/chatsScreen/searchView";
import { getChats } from "@lib/api";
import { useEffect, useState } from "react";
import { createSecureStorage } from "@lib/Storage";
import { useWebSocket } from "src/providers/WebSocketContext";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export default function CardScreen() {
  const scrollY = useSharedValue(0);
  const { headerHeight } = useChatsScreenStore();
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState();
  const ws = useWebSocket();

  useEffect(() => {
    (async () => {
      const Storage = await createSecureStorage("user-storage");

      setUserId(Storage.getString("user_id"));
    })()
  }, [])

  const renderItem = ({ item }) => {
    const recipient = item.members.find(member => member?.id !== parseInt(userId))

    return (
      <Chat
        chat={{
          lastMessage: "Последнее сообщение",
          lastMessageTime: "12:34",
          recipient,
          id: item?.id,
          avatar:
            "https://i.pinimg.com/736x/e9/83/3b/e9833b429842c971097ab6e9ad3bf6ca.jpg",
          unreadCount: item.id % 3,
        }}
      />
    );
  };

  const onscroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  useEffect(() => {
    (async () => {
      const res = await getChats(ws);
      setChats(res);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} />
      <SearchView />
      <AnimatedFlashList
        onScroll={onscroll}
        estimatedItemSize={100}
        data={chats}
        contentContainerStyle={{
          paddingTop: headerHeight,
        }}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        scrollEventThrottle={16}
        updateCellsBatchingPeriod={30}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
