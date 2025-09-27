import { View, Text } from "react-native";
import { styles } from "./EmptyModal.styles";
import Icon from "@components/ui/Icon";
import { useUnistyles } from "react-native-unistyles";
import Animated, {
  FadeOut,
  FadeIn,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useEffect, useState } from "react";
import getChatFromStorage from "@lib/getChatFromStorage";

export default function EmptyModal({ chat, visible }) {
  const { theme } = useUnistyles();
  const keyboard = useReanimatedKeyboardAnimation();

  const [isAllKeys, setIsAllKeys] = useState();

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] };
  });

  useEffect(() => {
    (async () => {
      const _chat = await getChatFromStorage(chat?.id);
      console.log(124, _chat)
      setIsAllKeys(!!_chat?.keys?.recipient?.ecdhPublicKey)
    })()
  }, [])

  return visible ? (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.wrapper, animatedStyles]}
    >
      <View style={styles.modal}>
        <Icon icon="message" size={80} color={theme.colors.cyan} />
        <View style={styles.content}>
          <Text style={styles.title}>{isAllKeys ? "Пока нет сообщений..." : "Собеседник не добавил ключи"}</Text>
          <Text style={styles.description}>
            {isAllKeys ? "Отправьте свое первое сообщение!" : "Дождитесь, когда собесседник зайдёт в сеть"}
          </Text>
        </View>
      </View>
    </Animated.View>
  ) : null;
}
