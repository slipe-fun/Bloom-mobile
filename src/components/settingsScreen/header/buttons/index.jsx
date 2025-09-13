import { Pressable } from "react-native";
import { styles } from "./buttons.styles";
import { Icon } from "@components/ui";
import useSettingsScreenStore from "@stores/settingsScreen";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

export default function HeaderButtons({ scrollY }) {
  const { snapEndPosition } = useSettingsScreenStore();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [snapEndPosition - 44, snapEndPosition], [1, 0]),
    height: interpolate(scrollY.value, [snapEndPosition - 44, snapEndPosition], [44, 0], "clamp"),
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [snapEndPosition - 22, snapEndPosition], [1, 0], "clamp") }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable style={styles.button}>
        <Animated.View style={animatedIconStyle}>
          <Icon icon="lightbolt" size={28} color="#fff" />
        </Animated.View>
      </Pressable>
      <Pressable style={styles.button}>
        <Animated.View style={animatedIconStyle}>
          <Icon icon="lightbolt" size={28} color="#fff" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
