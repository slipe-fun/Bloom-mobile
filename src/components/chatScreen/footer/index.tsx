import { styles } from "./Footer.styles";
import { useInsets } from "@hooks";
import Icon from "@components/ui/Icon";
import { useUnistyles } from "react-native-unistyles";
import { useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  layoutAnimationSpringy,
  paperplaneAnimationIn,
  paperplaneAnimationOut,
} from "@constants/animations";
import { Button, GradientBlur } from "@components/ui";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import MessageInput from "./MessageInput";
import useChatScreenStore from "@stores/chatScreen";
import { ViewStyle } from "react-native";

type FooterProps = {
  onSend?: (content: string, reply_to: number) => void;
  onLayout?: (value: number) => void;
};

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function Footer({ onSend, onLayout }: FooterProps) {
  const insets = useInsets();
  const { theme } = useUnistyles();
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation();
  const [value, setValue] = useState<string>("");
  const { replyMessage, setReplyMessage } = useChatScreenStore();

  const hasValue: boolean = value.trim() !== "";

  const handleSend = () => {
    if (hasValue) {
      onSend(value.trim(), replyMessage?.id);
      setValue("");
      setReplyMessage(null);
    }
  };

  const animatedViewStyles = useAnimatedStyle((): ViewStyle => {
    return {
      paddingBottom: interpolate(keyboardProgress.value, [0, 1], [insets.bottom, theme.spacing.lg], "clamp"),
      paddingHorizontal: interpolate(keyboardProgress.value, [0, 1], [theme.spacing.xxxl, theme.spacing.lg]),
    };
  });

  return (
    <Animated.View
      onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
      style={[styles.footer, animatedViewStyles]}
      layout={layoutAnimationSpringy}
    >
      <GradientBlur />
      {!hasValue && (
        <AnimatedButton blur exiting={zoomAnimationOut} entering={zoomAnimationIn} variant='icon'>
          <Icon icon='plus' size={26} color={theme.colors.text} />
        </AnimatedButton>
      )}

      <MessageInput setValue={setValue} hasValue={hasValue} value={value} />

      <Button
        onPress={handleSend}
        blur
        variant='icon'
      >
        {hasValue ? (
          <>
          <Animated.View entering={zoomAnimationIn} style={ styles.buttonBackground}/>
          <Animated.View key="paperplane" entering={paperplaneAnimationIn} exiting={paperplaneAnimationOut}>
            <Icon icon='paperplane' size={26} color={theme.colors.white} />
          </Animated.View></>
        ) : (
          <Animated.View key="waveform" entering={zoomAnimationIn} exiting={zoomAnimationOut}>
            <Icon icon='waveform' size={26} color={theme.colors.white} />
          </Animated.View>
        )}
      </Button>
    </Animated.View>
  );
}
