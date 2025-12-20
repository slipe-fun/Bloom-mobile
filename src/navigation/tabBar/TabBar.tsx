import { useInsets } from "@hooks";
import { LayoutChangeEvent } from "react-native";
import { styles } from "./TabBar.styles";
import { GradientBlur } from "@components/ui";
import useTabBarStore from "@stores/tabBar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import React, { useCallback } from "react";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useUnistyles } from "react-native-unistyles";
import useChatsStore from "@stores/chats";
import TabBarActionButtonDelete from "./deleteButton";
import TabBarContainer from "./tabBarContainer";

export default function TabBar({ state, navigation }): React.JSX.Element {
  const insets = useInsets();
  const { theme } = useUnistyles();
  const { setTabBarHeight, tabBarHeight, } = useTabBarStore();
  const tabBarWidth = useSharedValue(0);
  const { edit } = useChatsStore();
  const { progress: keyboardProgress, height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardHeight.value }],
    paddingBottom: interpolate(keyboardProgress.value, [0, 1], [insets.bottom, theme.spacing.lg], "clamp"),
  }));

  const onLayoutTabBar = useCallback((event: LayoutChangeEvent, isContainer: boolean = false) => {
    const { layout } = event.nativeEvent;

    if (tabBarWidth.value <= 1 && !isContainer) tabBarWidth.value = layout.width;

    if (tabBarHeight <= 1 && isContainer) setTabBarHeight(layout.height);
  }, []);

  return (
    <Animated.View
      onLayout={(event) => onLayoutTabBar(event, true)}
      style={[styles.tabBarContainer, animatedContainerStyle]}
    >
      <GradientBlur />
      {!edit ? (
        <TabBarContainer state={state} navigation={navigation}/>
      ) : (
        <TabBarActionButtonDelete />
      )}
    </Animated.View>
  );
}
