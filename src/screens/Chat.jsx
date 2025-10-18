import { View } from "react-native";
import Header from "@components/chatScreen/header";
import Footer from "@components/chatScreen/footer";
import Message from "@components/chatScreen/message";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import Animated, { LinearTransition } from "react-native-reanimated";
import { quickSpring } from "@constants/Easings";
import Transition from "react-native-screen-transitions";
import EmptyModal from "@components/chatScreen/emptyModal";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import useMessages from "@api/hooks/encryption/useMessages";
import getChatFromStorage from "@lib/getChatFromStorage";

const TransitionList = Transition.createTransitionAwareComponent(
  Animated.FlatList
);

export default function ChatScreen({ route }) {
  const { chat } = route.params;

  const { messages, addMessage } = useMessages(chat?.id);
  const [isAllKeys, setIsAllKeys] = useState();
  const [seenId, setSeenId] = useState(0);
  const [lastMessageId, setLastMessageId] = useState(0);

  const renderItem = useCallback(({ item }) => {
    return <Message seen={seenId === item?.id} isLast={lastMessageId === item?.id} message={item} chat={chat} />;
  }, [chat, seenId, lastMessageId]);

  useEffect(() => {
    (async () => {
      const _chat = await getChatFromStorage(chat?.id);
      setIsAllKeys(!!_chat?.keys?.recipient?.ecdhPublicKey)
    })()
  }, []);

  useEffect(() => {
      const lastSeenMessage = [...messages]?.reverse().find(m => m?.seen && m.isMe)
      setSeenId(lastSeenMessage?.id);

      setLastMessageId(messages[messages.length - 1]?.id);
  }, [messages])

  return (
    <View style={styles.container}>
      <Header chat={chat} />
      <EmptyModal chat={chat} visible={messages.length === 0} />
      <KeyboardAvoidingView
        behavior="translate-with-padding"
        style={styles.list}
      >
        <TransitionList
          data={[...messages]?.reverse()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={LinearTransition.springify()
            .mass(quickSpring.mass)
            .damping(quickSpring.damping)
            .stiffness(quickSpring.stiffness)}
        />
        <Footer isAllKeys={true} onSend={addMessage} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
  },
}));
