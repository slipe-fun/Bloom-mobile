import { Text, View } from "react-native";
import { styles } from "./Message.styles";
import { useUnistyles } from "react-native-unistyles";
import Svg, { Path } from "react-native-svg";
import { quickSpring } from "@constants/Easings";

import Animated, { ZoomIn } from "react-native-reanimated";
import decrypt from "@lib/skid/decrypt";
import { useEffect, useState } from "react";
import getChatFromStorage from "@lib/getChatFromStorage";

export default function Message({ message, chat }) {
  const { theme } = useUnistyles();
  const isMe = message.isMe;

  const [decrypted, setDecrypted] = useState({});

  useEffect(() => {
    (async () => {
      const _chat = await getChatFromStorage(chat?.id);
      setDecrypted(decrypt(message?.payload, isMe ? null : _chat?.keys?.my, isMe ? _chat?.keys?.my : _chat?.keys?.recipient, isMe));
    })()
  }, [])

  return (
    <View style={styles.messageWrapper(isMe)}>
      <Animated.View
        entering={ZoomIn.springify()
          .mass(quickSpring.mass)
          .damping(quickSpring.damping)
          .stiffness(quickSpring.stiffness)}
        style={styles.message(isMe)}
      >
        <Text style={styles.text(isMe)}>{decrypted.content}</Text>
        <Svg
          width="22"
          height="15"
          viewBox="0 0 22 15"
          style={styles.tail(isMe)}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M14.2202 0C15.5923 3.00023 17.3182 5.87218 19.3681 8.55043C21.4013 11.2068 22.4178 12.535 21.8387 13.7104C21.2596 14.8859 19.8726 14.9214 17.0987 14.9924C13.8388 15.0758 10.5094 14.4752 7.30625 13.1085C4.51431 11.9173 2.06115 10.2476 -8.18547e-07 8.23188C5.49249 7.00783 10.4402 4.09735 14.2202 0Z"
            fill={isMe ? theme.colors.primary : theme.colors.foreground}
          />
        </Svg>
      </Animated.View>
      <View style={styles.metaRow}>
        {isMe ? (
          <>
            <Text style={styles.metaRowText}>
              {message.viewed ? "Просмотрено" : "Отправлено"}
            </Text>
            <View style={styles.metaRowSeparator} />
          </>
        ) : null}
        <Text style={styles.metaRowText}>10:2{isMe ? 5 : 0}</Text>
      </View>
    </View>
  );
}
