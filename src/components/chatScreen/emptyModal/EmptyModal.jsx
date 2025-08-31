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

export default function EmptyModal({ visible }) {
  const { theme } = useUnistyles();
  const keyboard = useReanimatedKeyboardAnimation();

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] };
  });

  return visible ? (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.wrapper, animatedStyles]}
    >
      <View style={styles.modal}>
        <Icon icon="message" size={80} color={theme.colors.cyan} />
        <View style={styles.content}>
          <Text style={styles.title}>Пока нет сообщений...</Text>
          <Text style={styles.description}>
            Отправьте свое первое сообщение!
          </Text>
        </View>
      </View>
    </Animated.View>
  ) : null;
}
