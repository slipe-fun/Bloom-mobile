import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { styles } from "./Message.styles";
import Animated, {
  Easing,
  LayoutAnimationConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { zoomAnimationIn } from "@constants/animations";
import type { MessageInterface, Option } from "@interfaces";
import { quickSpring } from "@constants/easings";
import { Menu } from "@components/ui";
import { staticColor } from "unistyles";
import { useContextMenu } from "@hooks";
import useChatScreenStore from "@stores/chatScreen";
import MessageBubble from "./MessageBubble";
import MessageStatus from "./MessageStatus";

type MessageProps = {
  message: MessageInterface | null;
  seen?: boolean;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Message({ message, seen, isLast }: MessageProps): React.JSX.Element {
  const scale = useSharedValue(1);
  const { setReplyMessage } = useChatScreenStore();
  const { isOpen, closeMenu, menuPosition, triggerProps } = useContextMenu({ scaleBackground: true });

  const isMe: boolean = message?.isMe;

  const options: Option[] = [
  { label: "Скопировать", icon: "file", color: staticColor.white, action: "swag" },
  { label: "Ответить", icon: "arrow.left", color: staticColor.primary, action: () => setReplyMessage(message) },
  { label: "Закрепить", icon: "pin", color: staticColor.pink, action: "swag" },
  { separator: true },
  { label: "Изменить", icon: "pencil", color: staticColor.yellow, action: "swag" },
  { label: "Удалить сообщение", icon: "trash", color: staticColor.orange, action: "swag" },
];

  const onPress = (out: boolean = false) => {
    scale.value = withTiming(out ? 1 : 0.95, {easing: Easing.inOut(Easing.ease), duration: 300});
  };

  const animatedBubbleStyles = useAnimatedStyle(() => {
    return { transform: [{ scale: withSpring(isOpen ? 1.1 : scale.value, quickSpring) }], opacity: isOpen ? 0 : 1};
  });

  return (
    <AnimatedPressable
      onPressIn={() => onPress()}
      onPressOut={() => onPress(true)}
      entering={zoomAnimationIn}
      {...triggerProps}
      style={styles.messageWrapper(isMe)}
    >
      <MessageBubble style={animatedBubbleStyles} message={message}/>
      <LayoutAnimationConfig skipEntering skipExiting>
        <MessageStatus message={message} isLast={isLast} isMe={isMe} seen={seen}/>
      </LayoutAnimationConfig>
      <Menu
        position={menuPosition}
        message={message}
        bluredBackdrop
        options={options}
        isOpen={isOpen}
        closeMenu={closeMenu}
      />
    </AnimatedPressable>
  );
}