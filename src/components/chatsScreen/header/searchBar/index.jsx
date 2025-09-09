import { Pressable, TextInput, useWindowDimensions } from "react-native";
import { styles } from "./SearchBar.styles";
import { useRef, useState } from "react";
import { useUnistyles } from "react-native-unistyles";
import Icon from "@components/ui/Icon";
import Animated, { useSharedValue, withSpring, useAnimatedStyle, interpolate } from "react-native-reanimated";
import useChatsScreenStore from "@stores/ChatsScreen";
import { fastSpring } from "@constants/Easings";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SearchBar({ value, setValue, scrollY, focusedValue }) {
  const { theme } = useUnistyles();
  const { width: screenWidth } = useWindowDimensions();
  const inputRef = useRef(null);
  const initialWidth = useSharedValue(0);
  const width = useSharedValue(0);
  const { setFocused } = useChatsScreenStore();

  const fullWidth = screenWidth - theme.spacing.lg * 2;

  const onInputLayout = (e) => {
    if (initialWidth.value === 0) {
      const w = e.nativeEvent.layout.width;
      initialWidth.value = w;
      width.value = w;
    }
  };

  const handleFocus = () => {
    focusedValue.value = withSpring(0, fastSpring);
    setFocused(true);
    if (fullWidth) {
      width.value = withSpring(fullWidth, fastSpring);
    }
  };

  const handleBlur = () => {
    focusedValue.value = withSpring(1, fastSpring);
    setFocused(false);
    if (!value) {
      width.value = withSpring(initialWidth.value, fastSpring);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value || undefined,
  }));

  console.log(fullWidth);

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, 50], [0, -56], 'clamp') }],
    width: fullWidth ? interpolate(scrollY.value, [0, 50], [fullWidth, initialWidth.value + 56], 'clamp') : undefined,
  }));

  return (
    <AnimatedPressable
      onPress={() => inputRef.current?.focus()}
      style={[styles.inputWrapper, animatedWrapperStyle]}
    >
      <Icon
        icon="magnifyingglass"
        size={24}
        color={theme.colors.secondaryText}
      />
      <AnimatedTextInput
        ref={inputRef}
        onLayout={onInputLayout}
        onBlur={handleBlur}
        onChangeText={setValue}
        selectionColor={theme.colors.secondaryText}
        value={value}
        placeholderTextColor={theme.colors.secondaryText}
        onFocus={handleFocus}
        placeholder="Поиск по чатам"
        style={[styles.input, animatedStyle]}
      />
    </AnimatedPressable>
  );
}
