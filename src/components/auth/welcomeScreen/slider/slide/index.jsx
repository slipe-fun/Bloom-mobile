import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import { styles } from "./Slide.styles";
import Icon from "@components/ui/Icon";
import { Text } from "react-native";

export default function Slide({ item, index, position, offset }) {
  const animatedStyle = useAnimatedStyle(() => {
    const page = position.value + offset.value;
    const opacity = interpolate(
      page,
      [index - 1, index, index + 1],
      [0, 1, 0],
      "clamp"
    );
    const scale = interpolate(
      page,
      [index - 1, index, index + 1],
      [0.85, 1, 0.85],
      "clamp"
    );
    return { opacity, transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.page, animatedStyle]} key={index}>
      <Icon icon={item.icon} size={156} color={item.color} />
      <Text style={[styles.text, { color: item.color }]}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </Animated.View>
  );
}
