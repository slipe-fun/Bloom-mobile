import { Icon } from "@components/ui";
import { Text, View } from "react-native";
import Animated, { interpolate, interpolateColor, LinearTransition, useAnimatedProps, useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import { useState, useEffect } from "react";
import { getCharEnter, getCharExit } from "@constants/animations";
import { quickSpring } from "@constants/easings";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./title.styles";


export default function Title({ state }) {
  const [title, setTitle] = useState("Bloom");
  const stateValue = useSharedValue(0);
  const { theme } = useUnistyles();

  const animatedIconProps = useAnimatedProps(() => ({
    fill: interpolateColor(stateValue.value, [0, 1], [theme.colors.primary, theme.colors.yellow]),
  }));

  const animatedCharStyle = useAnimatedStyle(() => ({
    color: interpolateColor(stateValue.value, [0, 1], [theme.colors.primary, theme.colors.yellow]),
  }));

  useEffect(() => {
    setTitle(state === "connecting" ? "Подключение..." : "Bloom");
    stateValue.value = withSpring(state === "connecting" ? 1 : 0, quickSpring);
  }, [state]);

  return (
    <Animated.View style={[styles.container]}>
      <Icon icon="lightbolt" size={24} animatedProps={animatedIconProps} />
      <View style={styles.charStack}>
        {title.split("").map((char, i) => (
          <Animated.Text
            key={`${char}-${i}`}
            style={[styles.char, animatedCharStyle]}
            entering={getCharEnter(i)}
            exiting={getCharExit(i)}
            layout={LinearTransition.springify()
              .mass(quickSpring.mass)
              .damping(quickSpring.damping)
              .stiffness(quickSpring.stiffness)}
          >
            {char}
          </Animated.Text>
        ))}
      </View>
    </Animated.View>
  );
}
