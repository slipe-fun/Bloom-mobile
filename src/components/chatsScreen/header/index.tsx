import { Pressable, View } from "react-native";
import { styles } from "./header.styles";
import { useInsets } from "@hooks";
import { useState, useEffect } from "react";
import { Icon, Button } from "@components/ui";
import Animated from "react-native-reanimated";
import useChatsScreenStore from "@stores/ChatsScreen";
import Title from "./title";
import { useWebSocket } from "@api/providers/WebSocketContext";
import { GradientBlur } from "@components/ui";
import { useUnistyles, StyleSheet } from "react-native-unistyles";
import { BlurView } from "expo-blur";

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
          <BlurView style={StyleSheet.absoluteFill} intensity={40} tint='systemChromeMaterialDark' />
          <Icon icon='pencil' color={theme.colors.text} />
        </Button>
        <Title state={status} />
        <View style={styles.inView}/>
        <Animated.View style={styles.buttonsWrapper}>
          <BlurView style={StyleSheet.absoluteFill} intensity={40} tint='systemChromeMaterialDark' />
          <Button style={styles.button} variant='icon'>
            <Icon icon='magnifyingglass' color={theme.colors.text} />
          </Button>
          <Button style={styles.button} variant='icon'>
            <Icon icon='message' color={theme.colors.text} />
          </Button>
        </Animated.View>
      </View>
    </View>
  );
}
