import { TextInput } from "react-native";
import { styles } from "./Footer.styles";
import useInsets from "@hooks/useInsets";
import Icon from "@components/ui/Icon";
import { useUnistyles } from "react-native-unistyles";
import { useState } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { layoutAnimation } from "@constants/animations";
import { Button } from "@components/ui";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";

type FooterProps = {
  onSend?: (value) => void;
};

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function Footer({ onSend }: FooterProps) {
  const insets = useInsets();
  const { theme } = useUnistyles();
  const { progress } = useReanimatedKeyboardAnimation();
  const [value, setValue] = useState<string>("");

  const hasValue: boolean = value.trim() !== "";

  const handleSend = () => {
    if (hasValue) {
      onSend(value.trim());
      setValue("");
    }
  };

  const animatedViewStyles = useAnimatedStyle(() => {
    return {
      paddingBottom: interpolate(progress.value, [0, 1], [insets.bottom, theme.spacing.lg], "clamp"),
    };
  });

  return (
    <Animated.View style={[styles.footer, animatedViewStyles]}>
      {!hasValue && (
        <>
          <AnimatedButton exiting={zoomAnimationOut} entering={zoomAnimationIn} variant="icon">
            <Icon icon="image" size={24} color={theme.colors.text} />
          </AnimatedButton>
          <AnimatedButton exiting={zoomAnimationOut} entering={zoomAnimationIn} variant="icon">
            <Icon icon="face.smile" size={24} color={theme.colors.text} />
          </AnimatedButton>
        </>
      )}

      <Animated.View style={styles.inputWrapper} layout={layoutAnimation}>
        <TextInput
          style={styles.input}
          onChangeText={setValue}
          numberOfLines={4}
          keyboardAppearance="dark"
          multiline
          submitBehavior="newline"
          cursorColor={theme.colors.secondaryText}
          selectionColor={theme.colors.secondaryText}
          returnKeyType="previous"
          value={value}
          placeholderTextColor={theme.colors.secondaryText}
          placeholder="Cообщение..."
        />
        {hasValue ? (
          <AnimatedButton key="smile" exiting={zoomAnimationOut} entering={zoomAnimationIn} variant="icon">
            <Icon icon="face.smile" size={24} color={theme.colors.text} />
          </AnimatedButton>
        ) : (
          <AnimatedButton key="waveform" exiting={zoomAnimationOut} entering={zoomAnimationIn} variant="icon">
            <Icon icon="waveform" size={24} color={theme.colors.text} />
          </AnimatedButton>
        )}
      </Animated.View>

      {hasValue && (
        <AnimatedButton exiting={zoomAnimationOut} entering={zoomAnimationIn} onPress={handleSend} style={{ backgroundColor: theme.colors.primary }} variant="icon">
          <Icon icon="paperplane" size={24} color={theme.colors.white} />
        </AnimatedButton>
      )}
    </Animated.View>
  );
}
