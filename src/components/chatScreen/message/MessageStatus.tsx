import React from "react";
import Animated from "react-native-reanimated";
import { View, Text } from "react-native";
import { styles } from "./Message.styles";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import formatSentTime from "@lib/formatSentTime";
import { MessageInterface } from "@interfaces";

type MessageStatusProps = {
  message: MessageInterface;
  isMe: boolean;
  isLast: boolean;
  seen: boolean;
};

export default function MessageStatus({
  message,
  isMe,
  isLast,
  seen,
}: MessageStatusProps): React.JSX.Element {
  return (
    <View style={styles.metaRow}>
      {isMe && isLast && !seen ? (
        <>
          <Animated.Text
            exiting={zoomAnimationOut}
            entering={zoomAnimationIn}
            key='message-arrived'
            style={styles.metaRowText}
          >
            Доставлено
          </Animated.Text>
          <View style={styles.metaRowSeparator} />
        </>
      ) : null}
      {isMe && seen ? (
        <>
          <Animated.Text
            exiting={zoomAnimationOut}
            entering={zoomAnimationIn}
            key='message-seen'
            style={styles.metaRowText}
          >
            Просмотрено
          </Animated.Text>
          <View style={styles.metaRowSeparator} />
        </>
      ) : null}
      <Text style={styles.metaRowText}>{formatSentTime(message?.date)}</Text>
    </View>
  );
}
