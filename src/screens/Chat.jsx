import { View } from "react-native";
import Header from "@components/chatScreen/header";
import Footer from "@components/chatScreen/footer";
import Message from "@components/chatScreen/message";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import Animated, { LinearTransition } from "react-native-reanimated";
import { quickSpring } from "@constants/Easings";
import Transition from "react-native-screen-transitions";
import EmptyModal from "@components/chatScreen/emptyModal";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const TransitionList = Transition.createTransitionAwareComponent(
  Animated.FlatList
);

export default function ChatScreen({ route }) {
  const { chat } = route.params;

  const [messages, setMessages] = useState(
    Array.from({ length: 0 }).map((_, i) => ({ id: i.toString() }))
  );

  const addMessage = (e) => {
    setMessages((prev) => [
      { id: (prev.length + 1).toString(), isMe: true, text: e },
      ...prev,
    ]);
  };

  const renderItem = useCallback(({ item }) => {
    return <Message message={{ text: item.text, isMe: item.isMe }} />;
  }, []);

    return (
    <View style={styles.container}>
      <Header chat={chat} />
      <EmptyModal visible={messages.length === 0} />
      <KeyboardAvoidingView
        behavior="translate-with-padding"
        style={styles.list}
      >
        <TransitionList
          data={messages}
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
