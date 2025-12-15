import React, { useMemo, useCallback } from "react";
import { View, Text, Pressable as Pressable } from "react-native";
import Animated, { LayoutAnimationConfig } from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import Icon from "@components/ui/Icon";
import { Avatar } from "@components/ui";
import { useChatList } from "@api/providers/ChatsContext";
import { useWebSocket } from "@api/providers/WebSocketContext";
import { ROUTES } from "@constants/routes";
import {
  getCharEnter,
  getCharExit,
  getFadeIn,
  layoutAnimationSpringy,
  springyChar,
} from "@constants/animations";
import { styles } from "./Chat.styles";
import type { ChatView } from "@interfaces";
import useTokenTriggerStore from "@stores/tokenTriggerStore";

type ChatProps = {
  chat: ChatView;
  isSearch?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Chat({ chat, isSearch = false }: ChatProps) {
  const { theme } = useUnistyles();
  const navigation = useNavigation();
  const chats = useChatList();
  const ws = useWebSocket();
  const {userID} = useTokenTriggerStore();

  const recipient = chat?.recipient;
  const targetId = recipient?.id || chat?.id;

  const timeChars = useMemo(
    () => (!isSearch ? chat?.lastMessage?.time?.split("") || [] : null),
    [chat?.lastMessage?.time]
  );

  const navigateToChatScreen = useCallback(() => {
    const existingChat = chats?.find(
      (c) => c?.members?.some((m) => m?.id === userID) && c?.members?.some((m) => m?.id === targetId)
    );

    if (existingChat) {
      // @ts-ignore
      return navigation.navigate(ROUTES.chat, { chat: { ...chat, id: existingChat.id } });
    }

    ws.send(JSON.stringify({ type: "create_chat", recipient: targetId }));

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message?.chat) {
          ws.removeEventListener("message", handleMessage);
          // @ts-ignore
          navigation.navigate(ROUTES.chat, { chat: { ...chat, id: message.chat.id } });
        }
      } catch {}
    };

    ws.addEventListener("message", handleMessage);
  }, [chats, userID, targetId, chat, navigation, ws]);

  return (
    <AnimatedPressable entering={getFadeIn()} onPress={navigateToChatScreen} style={styles.chat}>
      <LayoutAnimationConfig skipEntering skipExiting>
        <View style={styles.avatarWrapper}>
          <Avatar size={!isSearch ? "lg" : "md"} image={chat?.avatar} username={recipient?.username} />
        </View>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>{recipient?.username}</Text>
            </View>

            <View style={styles.metaRow}>
              {!isSearch && (
                <View style={styles.charStack}>
                  {timeChars.map((char, i) => (
                    <Animated.Text
                      key={`${char}-${i}`}
                      style={styles.secondary}
                      entering={getCharEnter(springyChar(i))}
                      exiting={getCharExit(springyChar(i))}
                      layout={layoutAnimationSpringy}
                    >
                      {char}
                    </Animated.Text>
                  ))}
                </View>
              )}
              <Icon icon='chevron.right' size={16} color={theme.colors.secondaryText} />
            </View>
          </View>

          {!isSearch ? (
            <Animated.Text
              entering={getCharEnter()}
              exiting={getCharExit()}
              key={chat?.lastMessage.content}
              style={styles.secondary}
              numberOfLines={2}
            >
              {chat?.lastMessage.content}
            </Animated.Text>
          ) : (
            <Text style={styles.secondary}>@{recipient?.username}</Text>
          )}
        </View>
      </LayoutAnimationConfig>
    </AnimatedPressable>
  );
}
