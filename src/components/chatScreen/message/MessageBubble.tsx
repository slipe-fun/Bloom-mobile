import React from "react";
import { useUnistyles } from "react-native-unistyles";
import Svg, { Path } from "react-native-svg";
import type { Message } from "@interfaces";
import { ViewStyle, StyleProp, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { styles } from "./Message.styles";
import ReplyBlock from "../replyBlock";

type MessageBubbleProps = {
  message: Message | null;
  style?: StyleProp<ViewStyle>;
};

export default function MessageBubble({ message, style }: MessageBubbleProps): React.JSX.Element {
  const { theme } = useUnistyles();

  const isMe: boolean = message?.isMe;
  
  return (
    <Animated.View style={[styles.message(isMe), style]}>
      <ReplyBlock isMe={isMe} message={message.reply_to} />
      
      <View style={styles.messsageContent(message?.content?.length <= 2)}>
        <Text style={styles.text(isMe)}>{message?.content}</Text>
      </View>

      <Svg width='22' height='15' viewBox='0 0 22 15' style={styles.tail(isMe)} fill='none'>
        <Path
          d='M14.2202 0C15.5923 3.00023 17.3182 5.87218 19.3681 8.55043C21.4013 11.2068 22.4178 12.535 21.8387 13.7104C21.2596 14.8859 19.8726 14.9214 17.0987 14.9924C13.8388 15.0758 10.5094 14.4752 7.30625 13.1085C4.51431 11.9173 2.06115 10.2476 -8.18547e-07 8.23188C5.49249 7.00783 10.4402 4.09735 14.2202 0Z'
          fill={isMe ? theme.colors.primary : theme.colors.foreground}
        />
      </Svg>
    </Animated.View>
  );
}
