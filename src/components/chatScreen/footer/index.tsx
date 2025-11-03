import { styles } from "./Footer.styles";
import { useInsets } from "@hooks";
import Icon from "@components/ui/Icon";
import { useUnistyles } from "react-native-unistyles";
import { useState } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { layoutAnimationSpringy } from "@constants/animations";
import { Button } from "@components/ui";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { BlurView } from "expo-blur";
import { GradientBlur } from "@components/ui";
import MessageInput from "./MessageInput";
import useChatScreenStore from "@stores/chatScreen";

type FooterProps = {
  onSend?: (content: string, reply_to: number) => void;
  onLayout?: (value: number) => void;
};

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function Footer({ onSend, onLayout }: FooterProps) {
  const insets = useInsets();
  const { theme } = useUnistyles();
  const { progress } = useReanimatedKeyboardAnimation();
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

  const animatedViewStyles = useAnimatedStyle(() => {
    return {
      paddingBottom: interpolate(progress.value, [0, 1], [insets.bottom, theme.spacing.lg], "clamp"),
    };
  });

  return (
    <Animated.View onLayout={(e) => onLayout(e.nativeEvent.layout.height)} style={[styles.footer, animatedViewStyles]} layout={layoutAnimationSpringy}>
      <GradientBlur/>
      {!hasValue && (
        <>
          <AnimatedButton style={styles.button(false)} exiting={zoomAnimationOut} entering={zoomAnimationIn} variant='icon'>
            <BlurView style={styles.blur} intensity={40} tint='systemChromeMaterialDark' />
            <Icon icon='image' color={theme.colors.text} />
          </AnimatedButton>
          <AnimatedButton style={styles.button(false)} exiting={zoomAnimationOut} entering={zoomAnimationIn} variant='icon'>
            <BlurView style={styles.blur} intensity={40} tint='systemChromeMaterialDark' />
            <Icon icon='face.smile' color={theme.colors.text} />
          </AnimatedButton>
        </>
      )}

      <MessageInput setValue={setValue} hasValue={hasValue} value={value}/>

      {hasValue && (
        <AnimatedButton
          exiting={zoomAnimationOut}
          layout={layoutAnimationSpringy}
          entering={zoomAnimationIn}
          onPress={handleSend}
          style={{ backgroundColor: theme.colors.primary }}
          variant='icon'
        >
          <Icon icon='paperplane'  color={theme.colors.white} />
        </AnimatedButton>
      )}
    </Animated.View>
  );
}