import { Pressable } from "react-native";
import { styles } from "./header.styles";
import useInsets from "@hooks/useInsets";
import { useState, useEffect } from "react";
import Icon from "@components/ui/Icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import useChatsScreenStore from "@stores/ChatsScreen";
import Title from "./title";
import SearchBar from "./searchBar";
import { useWebSocket } from "@api/providers/WebSocketContext";

export default function Header({ scrollY }) {
  const ws = useWebSocket();
  const insets = useInsets();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("connecting");
  const focusedValue = useSharedValue(1);

  const { setHeaderHeight } = useChatsScreenStore();

  const onHeaderLayout = (e) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const interpolatedTranslateY = interpolate(scrollY.value, [0, 56], [0, -56], 'clamp');
    return {
      transform: [
        { translateY: interpolate(focusedValue.value, [0, 1], [-56, interpolatedTranslateY], 'clamp') },
      ],
    };
  });

  const topHeaderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: focusedValue.value,
    transform: [{scale: interpolate(focusedValue.value, [0, 1], [0.9, 1], 'clamp')}, {translateY: interpolate(scrollY.value, [0, 56], [0, 56], 'clamp')}],
  }));

  useEffect(() => {
    if (ws) {
      ws.onopen = () => setStatus("connected");
      ws.onclose = () => setStatus("connecting");
    }
  }, [ws]);

  return (
    <Animated.View
      onLayout={onHeaderLayout}
      style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}
    >
      <Animated.View style={[styles.topHeader, topHeaderAnimatedStyle]}>
        <Pressable style={styles.button}>
          <Icon icon="filter" size={24} color="white" />
        </Pressable>
       <Title scrollY={scrollY} state={status} />
        <Pressable style={styles.button}>
          <Icon icon="pencil" size={24} color="white" />
        </Pressable>
      </Animated.View>
      <SearchBar value={value} setValue={setValue} scrollY={scrollY} focusedValue={focusedValue} />
    </Animated.View>
  );
}
