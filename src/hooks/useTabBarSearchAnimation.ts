import { useWindowDimensions, ViewStyle } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  AnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { springyTabBar } from "@constants/animations";
import useTabBarStore from "@stores/tabBar";
import { useUnistyles } from "react-native-unistyles";
import { useEffect, useState } from "react";
import useChatsStore from "@stores/chats";

type SearchButtonAnimation = {
  animatedPressableStyle: AnimatedStyle<ViewStyle>;
  animatedIconStyle: AnimatedStyle<ViewStyle>;
  pressableOpacity: (toFull: boolean) => void;
  searchWidth: number;
  isDismiss: boolean;
  isLayoutAnimation: boolean;
};

export default function useTabBarSearchAnimation(): SearchButtonAnimation {
  const opacity = useSharedValue(1);
  const defaultWidth = useSharedValue(54);
  const { width } = useWindowDimensions();
  const { theme } = useUnistyles();
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation();
  const { isSearch, isSearchFocused, searchValue } = useTabBarStore();
  const { edit } = useChatsStore();
  const [isLayoutAnimation, setIsLayoutAnimation] = useState<boolean>(false);

  const searchWidth = width - 48 - theme.spacing.md;
  const isDismiss = isSearchFocused || searchValue.trim().length > 0;

  const animatedPressableStyle = useAnimatedStyle(() => {
    const baseWidth = isDismiss ? defaultWidth.value - 48 - theme.spacing.md : defaultWidth.value;

    return {
      opacity: opacity.value,
      width: interpolate(keyboardProgress.value, [0, 1], [baseWidth, searchWidth - theme.spacing.lg * 2]),
      height: withSpring(isSearch ? 48 : 54, springyTabBar),
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSearch ? 24 / 30 : 1, springyTabBar) }],
    };
  });

  const pressableOpacity = (toFull = true) => {
    opacity.value = withSpring(toFull ? 1 : 0.8, springyTabBar);
  };

  useEffect(() => {
    setIsLayoutAnimation(false);
    defaultWidth.value = withSpring(isSearch ? searchWidth - theme.spacing.xxxl * 2 : 54, springyTabBar, (finished: boolean) => {
      if (finished) runOnJS(setIsLayoutAnimation)(true);
    });
  }, [isSearch]);

  return {
    animatedPressableStyle,
    animatedIconStyle,
    pressableOpacity,
    searchWidth,
    isDismiss,
    isLayoutAnimation,
  };
}
