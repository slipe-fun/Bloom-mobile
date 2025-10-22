import { View } from "react-native";
import Header from "@components/chatScreen/header";
import Footer from "@components/chatScreen/footer";
import Message from "@components/chatScreen/message";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "./Chat.styles";
import Animated from "react-native-reanimated";
import Transition from "react-native-screen-transitions";
import EmptyModal from "@components/chatScreen/emptyModal";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import useMessages from "@api/hooks/encryption/useMessages";
import { Chat, MessageInterface } from "@interfaces";
import { layoutAnimationSpringy } from "@constants/animations";
import useScreenScale from "@hooks/useScreenScale";

interface ChatScreenProps {
  route: {
    params: Object;
  };
}

const TransitionList = Transition.createTransitionAwareComponent(Animated.FlatList);

export default function ChatScreen({ route }: ChatScreenProps) {
  const { chat } = route.params as { chat: Chat };

  const { messages, addMessage } = useMessages(chat?.id);
  const [seenId, setSeenId] = useState<number>(0);
  const [lastMessageId, setLastMessageId] = useState<number>(0);
  const { animatedScreenStyle } = useScreenScale();

  const renderItem = useCallback(
    ({ item }) => {
      return <Message seen={seenId === item?.id} isLast={lastMessageId === item?.id} message={item} />;
    },
    [seenId, lastMessageId]
  );

  useEffect(() => {
    const lastSeenMessage = [...messages]?.reverse().find((m) => m?.seen && m.isMe);
    setSeenId(lastSeenMessage?.id);

    setLastMessageId(messages[messages.length - 1]?.id);
  }, [messages]);

  return (
    <Animated.View style={[styles.container, animatedScreenStyle]}>
      <Header chat={chat} />
      <EmptyModal chat={chat} visible={messages.length === 0} />
      <KeyboardAvoidingView behavior='translate-with-padding' style={styles.list}>
        <TransitionList
          data={[...messages]?.reverse()}
          renderItem={renderItem}
          keyExtractor={(item: MessageInterface) => String(item?.id)}
          inverted
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={layoutAnimationSpringy}
        />
        <Footer onSend={addMessage} />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
