import Header from "@components/chatsScreen/header";
import Search from "@components/chatsScreen/search";
import React, { useCallback, useEffect, useState } from "react";
import { useChatList } from "@api/providers/ChatsContext";
import useChatsScreenStore from "@stores/chats";
import ChatItem from "@components/chatsScreen/chat/ChatItem";
import { createSecureStorage } from "@lib/storage";
import useTabBarStore from "@stores/tabBar";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { fastSpring } from "@constants/easings";
import { ViewStyle } from "react-native";
import { styles } from "./Chats.styles";
import type { Chat } from "@interfaces";
import { LegendList } from "@legendapp/list";
import { useInsets } from "@hooks";
import { EmptyModal } from "@components/ui";

export default function ChatsScreen(): React.JSX.Element {
  const { headerHeight } = useChatsScreenStore();
  const { tabBarHeight, isSearch } = useTabBarStore();
  const [userId, setUserId] = useState<number>(0);
  const insets = useInsets();
  const chats = useChatList();

  const animatedViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: withSpring(isSearch ? 0 : 1, fastSpring),
      transform: [{ scale: withSpring(isSearch ? 0.95 : 1, fastSpring) }],
    })
  );

  const keyExtractor = useCallback((item: Chat) => {
    return String(item.id);
  }, []);

  const renderItem = useCallback(({ item, id }: { item: Chat; id: number }) => {
    return <ChatItem item={item} userId={id} />;
  }, []);

  useEffect(() => {
    (async () => {
      const storage = await createSecureStorage("user-storage");
      setUserId(parseInt(storage.getString("user_id")));
    })();
  }, []);

  return (
    <>
      <Search />
      <Animated.View style={[styles.container, animatedViewStyle]}>
        <Header />
        <LegendList
          data={chats}
          style={styles.list}
          renderItem={({ item }) => renderItem({ item, id: userId })}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator
          contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: tabBarHeight }}
          scrollIndicatorInsets={{
            top: headerHeight - insets.realTop,
            bottom: tabBarHeight - insets.realBottom,
          }}
        />
        {chats?.length === 0 ? (
          <EmptyModal
            text='У вас еще нет ни одного чата! Создайте свой первый чат!'
            icon='message'
            color='primary'
          />
        ) : null}
      </Animated.View>
    </>
  );
}
