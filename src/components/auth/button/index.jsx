import { Pressable, Text, StyleSheet } from "react-native";
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./Button.styles";
import { quickSpring } from "@constants/Easings";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Button({ animatedStyle, shimmer = false, onPress, children }) {
  const scale = useSharedValue(1);
  const shimmerX = useSharedValue(-200);

  const handlePress = () => {
    onPress?.();
    scale.value = shimmer ? withSpring(1.1, quickSpring) : withSpring(1.05, quickSpring);
  };

  const handleRelease = () => {
    scale.value = withSpring(1, quickSpring);
  };

  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  useEffect(() => {
    if (shimmer) {
      shimmerX.value = withRepeat(
        withTiming(300, { duration: 2500 }),
        -1,
        false
      );
    } 
  }, [shimmer]);

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle, animatedScaleStyle]}
      onPressIn={handlePress}
      onPressOut={handleRelease}
    >
      <Text style={styles.text}>{children}</Text>

      {shimmer && (
        <AnimatedLinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius: styles.button.borderRadius },
            shimmerStyle,
          ]}
        />
      )}
    </AnimatedPressable>
  );
}
