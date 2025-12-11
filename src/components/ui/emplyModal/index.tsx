import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { styles } from "./EmptyModal.styles";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { Icon } from "@components/ui";
import { ICONS } from "@constants/icons";
import { useUnistyles } from "react-native-unistyles";
import { staticColor } from "unistyles";

type EmptyModalProps = {
  text: string | React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  icon?: keyof typeof ICONS;
  iconElement?: React.JSX.Element;
  color: keyof typeof staticColor;
  visible: boolean;
};

export default function EmptyModal({
  text,
  style,
  icon,
  iconElement,
  color,
  visible = true,
  ...props
}: EmptyModalProps): React.JSX.Element {
  const { theme } = useUnistyles();
  const keyboard = useReanimatedKeyboardAnimation();

  const animatedStyles = useAnimatedStyle((): ViewStyle => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] };
  });

  return (
    visible && (
      <Animated.View style={[styles.wrapper, animatedStyles]}>
        <Animated.View
          entering={zoomAnimationIn}
          exiting={zoomAnimationOut}
          style={[styles.modal, style]}
          {...props}
        >
          {!iconElement ? (
            <View style={styles.iconWrapper(color)}>
              <Icon size={40} color={theme.colors[color]} icon={icon} />
            </View>
          ) : (
            iconElement
          )}
          <Text style={styles.title}>{text}</Text>
        </Animated.View>
      </Animated.View>
    )
  );
}
