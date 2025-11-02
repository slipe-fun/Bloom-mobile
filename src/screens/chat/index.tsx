import Header from "@components/chatScreen/header";
import Footer from "@components/chatScreen/footer";
import Message from "@components/chatScreen/message";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "./Chat.styles";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import Transition from "react-native-screen-transitions";
import EmptyModal from "@components/chatScreen/emptyModal";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import useMessages from "@api/hooks/encryption/useMessages";
import { Chat, MessageInterface } from "@interfaces";
import { layoutAnimationSpringy, springy } from "@constants/animations";
import { useScreenScale } from "@hooks";

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
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
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

  const animatedListStyles = useAnimatedStyle(() => ({
    paddingTop: withSpring(footerHeight - 16, springy),
  }))

  return (
    <Animated.View style={[styles.container, animatedScreenStyle]}>
      <Header onLayout={setHeaderHeight} chat={chat} />
      <EmptyModal chat={chat} visible={messages.length === 0} />
      <KeyboardAvoidingView behavior='translate-with-padding' style={styles.list}>
        <TransitionList
          data={[...messages]?.reverse()}
          renderItem={renderItem}
          keyExtractor={(item: MessageInterface) => String(item?.id)}
          inverted
          removeClippedSubviews
          contentContainerStyle={[styles.listContent, {paddingBottom: headerHeight}]}
          style={[styles.list, animatedListStyles]}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={layoutAnimationSpringy}
        />
        <Footer onLayout={setFooterHeight} onSend={addMessage} />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
