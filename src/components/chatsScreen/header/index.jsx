import { Text, Pressable, TextInput } from "react-native";
import { styles } from "./Header.styles";
import useInsets from "@hooks/UseInsets";
import { useState, useRef } from "react";
import Icon from "@components/ui/Icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { fastSpring } from "@constants/Easings";
import { useUnistyles } from "react-native-unistyles";
import useChatsScreenStore from "@stores/ChatsScreen";
import Title from "./title";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function Header({ scrollY }) {
  const insets = useInsets();
  const fullWidth = useSharedValue(0);
  const { theme } = useUnistyles();
  const inputRef = useRef(null);
  const width = useSharedValue(0);
  const [value, setValue] = useState("");
  const initialWidth = useSharedValue(0);
  const focusedValue = useSharedValue(1);

  const { setFocused, setHeaderHeight } = useChatsScreenStore();

  const handleFocus = () => {
    focusedValue.value = withSpring(0, fastSpring);
    setFocused(true);
    if (fullWidth.value) {
      width.value = withSpring(fullWidth.value, fastSpring);
    }
  };

  const handleBlur = () => {
    focusedValue.value = withSpring(1, fastSpring);
    setFocused(false);
    if (!value) {
      width.value = withSpring(initialWidth.value, fastSpring);
    }
  };

  const onHeaderLayout = (e) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  const onWrapperLayout = (e) => {
    fullWidth.value = e.nativeEvent.layout.width - 52;
  };

  const onInputLayout = (e) => {
    if (initialWidth.value === 0) {
      const w = e.nativeEvent.layout.width;
      initialWidth.value = w;
      width.value = w;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value || undefined,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(focusedValue.value, [1, 0], [0, -56]) },
    ],
  }));

  const topHeaderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: focusedValue.value,
  }));

  return (
    <Animated.View
      onLayout={onHeaderLayout}
      style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}
    >
      <Animated.View style={[styles.topHeader, topHeaderAnimatedStyle]}>
        <Pressable style={styles.button}>
          <Icon icon="filter" size={24} color="black" />
        </Pressable>
       <Title scrollY={scrollY} state="connecting" />
        <Pressable style={styles.button}>
          <Icon icon="pencil" size={24} color="black" />
        </Pressable>
      </Animated.View>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          onLayout={onWrapperLayout}
          style={styles.inputWrapper}
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
        </Pressable>
    </Animated.View>
  );
}
