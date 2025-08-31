import { Keyboard, Pressable, TextInput } from "react-native";
import { styles } from "./Footer.styles";
import useInsets from "@hooks/UseInsets";
import Icon from "@components/ui/Icon";
import { useUnistyles } from "react-native-unistyles";
import { useEffect, useState } from "react";
import Animated, {
  LinearTransition,
  useAnimatedKeyboard,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { quickSpring } from "@constants/Easings";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const zoomAnimation = {
  entering: ZoomIn.springify()
    .mass(quickSpring.mass)
    .damping(quickSpring.damping)
    .stiffness(quickSpring.stiffness),
  exiting: ZoomOut.springify()
    .mass(quickSpring.mass)
    .damping(quickSpring.damping)
    .stiffness(quickSpring.stiffness),
};

const layoutAnimation = LinearTransition.springify()
  .mass(quickSpring.mass)
  .damping(quickSpring.damping)
  .stiffness(quickSpring.stiffness);

const ActionButton = ({ icon, isSendButton, onPress }) => {
  const { theme } = useUnistyles();
  const color = isSendButton ? theme.colors.white : theme.colors.text;

  return (
    <AnimatedPressable
      {...zoomAnimation}
      style={styles.button(isSendButton)}
      onPress={onPress}
    >
      <Icon icon={icon} size={24} color={color} />
    </AnimatedPressable>
  );
};

export default function Footer({ onSend }) {
  const insets = useInsets();
  const { theme } = useUnistyles();
  const [value, setValue] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  useEffect(() => {
   const keyboardShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardVisible(true);
    }); 
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [])
  
  const handleSend = () => {
    if (value.trim() !== "") {
      onSend(value.trim());
      setValue("");
    }
  };

  const hasValue = value.trim() !== "";

  return (
    <Animated.View
      style={[styles.footer, { paddingBottom: keyboardVisible ? 16 : insets.bottom }]}
    >
      {!hasValue && (
        <>
          <ActionButton icon="dots" />
          <ActionButton icon="face.smile" />
        </>
      )}

      <AnimatedTextInput
        layout={layoutAnimation}
        style={styles.input}
        onChangeText={setValue}
        numberOfLines={4}
        multiline
        submitBehavior="newline"
        cursorColor={theme.colors.secondaryText}
        selectionColor={theme.colors.secondaryText}
        returnKeyType="previous"
        value={value}
        placeholderTextColor={theme.colors.secondaryText}
        placeholder="Введите сообщение..."
      />

      {hasValue && (
        <ActionButton icon="paperplane" isSendButton onPress={handleSend} />
      )}
    </Animated.View>
  );
}
