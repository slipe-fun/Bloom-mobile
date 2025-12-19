import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, { LayoutAnimationConfig } from "react-native-reanimated";
import Icon from "../Icon";
import { useUnistyles } from "react-native-unistyles";
import { charAnimationIn, charAnimationOut, zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { styles } from "./Checkbox.styles";
import { Haptics } from "react-native-nitro-haptics";

type CheckboxProps = {
  onValueChange?: (value: boolean) => void;
  value: boolean;
  style?: StyleProp<ViewStyle>;
  ref?: React.Ref<View>;
  onTouch?: () => void;
} & React.ComponentProps<typeof Pressable>;

export default function Checkbox({
  onValueChange,
  value,
  style,
  ref,
  onTouch,
  ...props
}: CheckboxProps): React.JSX.Element {
  const { theme } = useUnistyles();

  const onCheckBoxPressed = () => {
     onTouch ? onTouch() : Haptics.impact("light"); onValueChange?.(!value)     
  }

  return (
    <Pressable ref={ref} onPress={() => onCheckBoxPressed()} style={[styles.checkbox, style]} {...props}>
      <LayoutAnimationConfig skipEntering skipExiting>
        {value ? (
          <>
            <Animated.View
              style={styles.background}
              entering={zoomAnimationIn}
              exiting={zoomAnimationOut}
              key='checkboxBackground'
            />
            <Animated.View entering={charAnimationIn} exiting={charAnimationOut} key='checkboxIcon'>
              <Icon icon='checkmark' size={16} color={theme.colors.white} />
            </Animated.View>
          </>
        ) : null}
      </LayoutAnimationConfig>
    </Pressable>
  );
}
