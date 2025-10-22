import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./Message.styles";
import { useUnistyles } from "react-native-unistyles";
import Svg, { Path } from "react-native-svg";
import Animated, {
  Easing,
  LayoutAnimationConfig,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import formatSentTime from "@lib/formatSentTime";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { MessageInterface } from "@interfaces";
import { quickSpring } from "@constants/easings";
import physicsSpring from "@lib/physicSpring";
import { useRef, useState } from "react";
import Menu from "@components/ui/menu";
import { Haptics } from "react-native-nitro-haptics";
import useContextMenuStore from "src/stores/contextMenu";

type MessageProps = {
  message: MessageInterface | null;
  seen?: boolean;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Message({ message, seen, isLast }: MessageProps): React.ReactNode {
  const scale = useSharedValue(1);
  const ref = useRef<View>(null);
  const [messageMenu, setMessageMenu] = useState(false);
  const {setFocused} = useContextMenuStore();
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const isMe: boolean = message?.isMe;

  const onPress = (out: boolean = false) => {
    scale.value = withTiming(out ? 1 : 0.95, {easing: Easing.inOut(Easing.ease), duration: 350});
  };

  const onLongPress = () => {
    setFocused(true);
    scale.value = 1
    ref.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      setPosition({ top: py, left: px, width });
      setMessageMenu(true);
      Haptics.impact("medium");
    });
  };

  const animatedBubbleStyles = useAnimatedStyle(() => {
    return { transform: [{ scale: withSpring(messageMenu ? 1.1 : scale.value, quickSpring) }], opacity: messageMenu ? 0 : 1};
  });

  return (
    <AnimatedPressable
      ref={ref}
      onLongPress={() => onLongPress()}
      onPressIn={() => onPress()}
      onPressOut={() => onPress(true)}
      entering={zoomAnimationIn}
      delayLongPress={350}
      style={styles.messageWrapper(isMe)}
    >
      <MessageBubble style={animatedBubbleStyles} message={message}/>
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
      <Menu
        position={position}
        message={message}
        bluredBackdrop
        options={[{ icon: "compass", label: "swag", action: "sex", color: "#fff" }]}
        open={messageMenu}
        onClose={() => {setMessageMenu(false); setFocused(false)}}
      />
    </AnimatedPressable>
  );
}

export function MessageBubble({ message, style }: MessageProps) {
  const { theme } = useUnistyles();

  const isMe: boolean = message?.isMe;
  return (
    <Animated.View style={[styles.message(message.isMe), style]}>
      <Text style={styles.text(isMe)}>{message.content}</Text>
      <Svg width='22' height='15' viewBox='0 0 22 15' style={styles.tail(isMe)} fill='none'>
        <Path
          d='M14.2202 0C15.5923 3.00023 17.3182 5.87218 19.3681 8.55043C21.4013 11.2068 22.4178 12.535 21.8387 13.7104C21.2596 14.8859 19.8726 14.9214 17.0987 14.9924C13.8388 15.0758 10.5094 14.4752 7.30625 13.1085C4.51431 11.9173 2.06115 10.2476 -8.18547e-07 8.23188C5.49249 7.00783 10.4402 4.09735 14.2202 0Z'
          fill={isMe ? theme.colors.primary : theme.colors.foreground}
        />
      </Svg>
    </Animated.View>
  );
}
