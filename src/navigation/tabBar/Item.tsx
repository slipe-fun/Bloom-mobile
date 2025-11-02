import React, { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { quickSpring } from "@constants/easings";
import Icon from "@components/ui/Icon";
import { styles } from "./tabBar.styles";

interface TabBarItemProps {
  route: { name: "tab_chats" | "tab_search" | "tab_settings" };
  focused: boolean;
  onPress: () => void;
}

const TAB_ICONS = {
  tab_chats: "message",
  tab_search: "compass",
  tab_settings: "gear",
} as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabBarItem({ route, focused, onPress }: TabBarItemProps): React.JSX.Element {
  const { theme } = useUnistyles();
  const opacity = useSharedValue(0.35);
  const scale = useSharedValue(1);

  const tabColor = {
    tab_chats: theme.colors.cyan,
    tab_search: theme.colors.yellow,
    tab_settings: theme.colors.orange,
  }[route.name];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const animatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(opacity.value, [0.35, 1], [theme.colors.text, tabColor]),
  }));

  useEffect(() => {
    opacity.value = withSpring(focused ? 1 : 0.35, quickSpring);
  }, [focused]);

  return (
    <AnimatedPressable
      style={[styles.tabBarItem, animatedStyle]}
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.9, quickSpring))}
      onPressOut={() => (scale.value = withSpring(1, quickSpring))}
    >
      <Icon animatedProps={animatedProps} size={30} icon={TAB_ICONS[route.name]} />
    </AnimatedPressable>
  );
}
