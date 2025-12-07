import { View } from "react-native";
import { styles } from "./header.styles";
import { useInsets } from "@hooks";
import { useState, useEffect } from "react";
import { Icon, Button } from "@components/ui";
import useChatsScreenStore from "@stores/ChatsScreen";
import Title from "./Title";
import { useWebSocket } from "@api/providers/WebSocketContext";
import { GradientBlur } from "@components/ui";
import { useUnistyles } from "react-native-unistyles";

export default function Header() {
  const ws = useWebSocket();
  const insets = useInsets();
  const { theme } = useUnistyles();
  const [status, setStatus] = useState("connecting");

  const { setHeaderHeight } = useChatsScreenStore();

  useEffect(() => {
    if (ws) {
      ws.onopen = () => setStatus("connected");
      ws.onclose = () => setStatus("connecting");
    }
  }, [ws]);

  return (
    <View
      onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      style={[styles.header, { paddingTop: insets.top }]}
    >
      <GradientBlur direction='top-to-bottom' />
      <View style={[styles.topHeader]}>
        <Button blur variant='icon'>
          <Icon icon='pencil' color={theme.colors.text} />
        </Button>
        <Title state={status} />
        <Button blur variant='icon'>
          <Icon icon='plus' color={theme.colors.text} />
        </Button>
      </View>
    </View>
  );
}
