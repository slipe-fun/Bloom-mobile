import Header from "@components/chatsScreen/header";
import Search from "@components/chatsScreen/search";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { useChatList } from "@api/providers/ChatsContext";
import useChatsScreenStore from "@stores/ChatsScreen";
import ChatItem from "@components/chatsScreen/chat/ChatItem";
import { createSecureStorage } from "@lib/storage";
import useTabBarStore from "@stores/tabBar";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { fastSpring } from "@constants/easings";

export default function ChatsScreen() {
  const { headerHeight } = useChatsScreenStore();
  const { tabBarHeight } = useTabBarStore();
  const { isSearch } = useTabBarStore();
  const [userId, setUserId] = useState();
  const chats = useChatList();

  const animatedViewStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isSearch ? 0 : 1, fastSpring),
    transform: [{ scale: withSpring(isSearch ? 0.95 : 1, fastSpring)}]
  }))

  useEffect(() => {
    (async () => {
      const storage = await createSecureStorage("user-storage");
      setUserId(storage.getString("user_id"));
    })()
  }, [])
  
  return (
    <>
    <Search />
    <Animated.View style={[styles.container, animatedViewStyle]}>
      <Header />
      <FlashList
        data={chats}
        renderItem={({ item, index }) => <ChatItem item={item} index={index} userId={parseInt(userId)} />}
        keyExtractor={(item) => item?.id.toString()}
        estimatedItemSize={100}
        contentInset={{ top: headerHeight, bottom: tabBarHeight}}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={30}
      />
    </Animated.View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
