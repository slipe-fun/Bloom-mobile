import { AnimatedPressable } from "@components/animated/AnimatedPressable";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";

export default function Button({ onPress }) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

  return <AnimatedPressable style={animatedStyle} onPress={onPress}>Приступим!</AnimatedPressable>;
}
