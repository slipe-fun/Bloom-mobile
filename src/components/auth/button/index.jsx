import { Pressable, Text } from "react-native";
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { styles } from "./Button.styles";
import { quickSpring } from "@constants/Easings";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({ animatedStyle }) {
  const scale = useSharedValue(1);


  const handlePress = () => {
    scale.value = withSpring(1.1, quickSpring);
  };

  const handleRelease = () => {
    scale.value = withSpring(1, quickSpring);
  }

  const animatedScaleStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle, animatedScaleStyle]}
      onPressIn={handlePress}
      onPressOut={handleRelease}
    >
      <Text style={styles.text}>Начать общение!</Text>
    </AnimatedPressable>
  );
}
