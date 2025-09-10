import { Pressable } from "react-native";
import { styles } from "./Header.styles";
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
import { useWebSocket } from "@providers/WebSocketContext";

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

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(focusedValue.value, [1, 0], [0, -56]) },
    ],
  }));

  const topHeaderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: focusedValue.value,
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
          <Icon icon="filter" size={24} color="black" />
        </Pressable>
       <Title scrollY={scrollY} state={status} />
        <Pressable style={styles.button}>
          <Icon icon="pencil" size={24} color="black" />
        </Pressable>
      </Animated.View>
      <SearchBar value={value} setValue={setValue} scrollY={scrollY} focusedValue={focusedValue} />
    </Animated.View>
  );
}
