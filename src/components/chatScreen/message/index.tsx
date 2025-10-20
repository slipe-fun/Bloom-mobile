import { Text, View } from "react-native";
import { styles } from "./Message.styles";
import { useUnistyles } from "react-native-unistyles";
import Svg, { Path } from "react-native-svg";
import Animated, { LayoutAnimationConfig } from "react-native-reanimated";
import formatSentTime from "@lib/formatSentTime";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { MessageInterface } from "@interfaces";

type MessageProps = {
  message: MessageInterface | null;
  seen: Boolean;
  isLast: Boolean;
};

export default function Message({ message, seen, isLast }: MessageProps): React.ReactNode {
  const { theme } = useUnistyles();
  const isMe: Boolean = message?.isMe;

  return (
    <Animated.View entering={zoomAnimationIn} style={styles.messageWrapper(isMe)}>
      <View style={styles.message(isMe)}>
        <Text style={styles.text(isMe)}>{message?.content}</Text>
        <Svg width='22' height='15' viewBox='0 0 22 15' style={styles.tail(isMe)} fill='none'>
          <Path
            d='M14.2202 0C15.5923 3.00023 17.3182 5.87218 19.3681 8.55043C21.4013 11.2068 22.4178 12.535 21.8387 13.7104C21.2596 14.8859 19.8726 14.9214 17.0987 14.9924C13.8388 15.0758 10.5094 14.4752 7.30625 13.1085C4.51431 11.9173 2.06115 10.2476 -8.18547e-07 8.23188C5.49249 7.00783 10.4402 4.09735 14.2202 0Z'
            fill={isMe ? theme.colors.primary : theme.colors.foreground}
          />
        </Svg>
      </View>
      <LayoutAnimationConfig skipEntering skipExiting>
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
      </LayoutAnimationConfig>
    </Animated.View>
  );
}
