import { View, Text } from "react-native";
import { styles } from "./EmptyModal.styles";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { Avatar } from "@components/ui";
import { Chat } from "@interfaces";

type EmptyModalProps = {
  chat: Chat | null;
  visible: boolean;
};

export default function EmptyModal({ chat, visible }: EmptyModalProps): React.ReactNode {
  const keyboard = useReanimatedKeyboardAnimation();

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] };
  });

  return visible ? (
    <Animated.View style={[styles.wrapper, animatedStyles]}>
      <Animated.View entering={zoomAnimationIn} exiting={zoomAnimationOut} style={styles.modal}>
        <Avatar username={chat?.recipient?.username} image={chat?.recipient?.avatar} size="xl" />
        <Text style={styles.title(false)}>
          Вы начали чат с <Text style={styles.title(true)}>{chat?.recipient?.username}</Text> - отправьте своё первое сообщение!
        </Text>
      </Animated.View>
    </Animated.View>
  ) : null;
}
