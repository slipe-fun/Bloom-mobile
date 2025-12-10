import { styles } from "./Footer.styles";
import { useInsets } from "@hooks";
import Icon from "@components/ui/Icon";
import { useUnistyles } from "react-native-unistyles";
import { useEffect, useState } from "react";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  layoutAnimationSpringy,
  paperplaneAnimationIn,
  paperplaneAnimationOut,
  quickSpring,
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
  const sendAnimationProgress = useSharedValue(0);
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

  const animatedButtonStyle = useAnimatedStyle(
    (): ViewStyle => ({
      backgroundColor: interpolateColor(
        sendAnimationProgress.value,
        [0, 1],
        [theme.colors.foregroundBlur, theme.colors.primary]
      ),
    })
  );

  useEffect(() => {
    sendAnimationProgress.value = withSpring(hasValue ? 1 : 0, quickSpring);
  }, [hasValue]);

  return (
    <Animated.View
      onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
      style={[styles.footer, animatedViewStyles]}
      layout={layoutAnimationSpringy}
    >
      <GradientBlur />
      {!hasValue && (
        <AnimatedButton layout={layoutAnimationSpringy} blur exiting={zoomAnimationOut} entering={zoomAnimationIn} variant='icon'>
          <Icon icon='plus' size={26} color={theme.colors.text} />
        </AnimatedButton>
      )}

      <MessageInput setValue={setValue} hasValue={hasValue} value={value} />

      <AnimatedButton
        exiting={zoomAnimationOut}
        layout={layoutAnimationSpringy}
        entering={zoomAnimationIn}
        onPress={handleSend}
        blur
        style={animatedButtonStyle}
        variant='icon'
      >
        {hasValue ? (
          <Animated.View key="paperplane" entering={paperplaneAnimationIn} exiting={paperplaneAnimationOut}>
            <Icon icon='paperplane' size={26} color={theme.colors.white} />
          </Animated.View>
        ) : (
          <Animated.View key="waveform" entering={zoomAnimationIn} exiting={zoomAnimationOut}>
            <Icon icon='waveform' size={26} color={theme.colors.white} />
          </Animated.View>
        )}
      </AnimatedButton>
    </Animated.View>
  );
}
