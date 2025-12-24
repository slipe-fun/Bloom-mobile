import { styles } from "./Header.styles";
import HeaderAvatar from "./avatar";
import { useInsets } from "@hooks";
import useSettingsScreenStore from "@stores/settingsScreen";
import UserInformation from "./user";
import React from "react";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { GradientBlur } from "@components/ui";
import { TextStyle, ViewStyle } from "react-native";

type FloatingHeaderProps = {
    scrollY: SharedValue<number>;
    user: any;
}

export default function FloatingHeader({ scrollY, user }: FloatingHeaderProps): React.JSX.Element {
  const insets = useInsets();
  const { snapEndPosition } = useSettingsScreenStore();

  const animatedViewStyle = useAnimatedStyle((): ViewStyle => ({
    opacity: interpolate(scrollY.get(), [snapEndPosition / 2, snapEndPosition], [0, 1])
  }))

  const animatedTextStyle = useAnimatedStyle((): TextStyle => ({
    transform: [
        { translateY: interpolate(scrollY.get(), [snapEndPosition / 2, snapEndPosition], [24, 0], "clamp")}
    ]
  }))

  return (
    <Animated.View pointerEvents="none" style={[styles.floatingHeader(insets.top), animatedViewStyle]}>
        <GradientBlur direction="top-to-bottom"/>
       <Animated.Text style={[styles.floatingHeaderTitle, animatedTextStyle]}>Dikiy boss</Animated.Text>
    </Animated.View>
  );
}
