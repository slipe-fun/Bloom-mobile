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
import getChatFromStorage from "@lib/getChatFromStorage";
import encrypt from "@lib/skid/encrypt";
import initRealm from "@lib/initRealm";
import { createSecureStorage } from "@lib/Storage";
import { useMessagesList } from "@providers/MessagesContext";
import sendMessage from "@lib/sendMessage";
import { useWebSocket } from "@providers/WebSocketContext";

const TransitionList = Transition.createTransitionAwareComponent(
  Animated.FlatList
);

export default function ChatScreen({ route }) {
  const { chat } = route.params;

  const [messages, setMessages] = useState([]);

  const newMessages = useMessagesList();
  const ws = useWebSocket();

  const addMessage = async (e) => {
    try {
      const storage = await createSecureStorage("user-storage");
      await sendMessage(e, chat?.id, messages?.length, ws).catch(console.log)

      setMessages((prev) => [...prev, { 
          id: String((prev.length + 1)), 
          isMe: true, 
          chat_id: chat?.id, 
          content: e, 
          author_id: parseInt(storage?.getString("user_id")),
          date: new Date(),
          seen: false
        }]);
    } catch (error) {
      console.log(error)
    }
  };

  const renderItem = useCallback(({ item }) => {
    return <Message message={item} chat={chat} />;
  }, [chat]);

  useEffect(() => {
    (async () => {
      const storage = await createSecureStorage("user-storage");

      const realm = await initRealm();

      const messages = realm.objects("Message").filtered("chat_id == $0", chat?.id);

      setMessages(prev => [...prev, ...messages?.map(message => ({
        ...message, isMe: message?.author_id === parseInt(storage.getString("user_id"))
      }))])
    })()
  }, [])

  useEffect(() => {
    if (newMessages?.messages?.length === 0) return;
    (async () => {
      const storage = await createSecureStorage("user-storage");

      setMessages(prev => [...prev, ...newMessages?.messages?.map(message => ({
        ...message, isMe: message?.from_id === parseInt(storage.getString("user_id"))
      }))])

      newMessages?.clear();
    })()
  }, [newMessages])

  return (
    <View style={styles.container}>
      <Header chat={chat} />
      <EmptyModal visible={messages.length === 0} />
      <KeyboardAvoidingView
        behavior="translate-with-padding"
        style={styles.list}
      >
        <TransitionList
          data={[...messages].reverse()}
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
        <Footer onSend={addMessage} />
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
