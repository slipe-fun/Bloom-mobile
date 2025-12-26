import Animated, {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import useSettingsScreenStore from "@stores/settings";
import { BlurView, BlurViewProps } from "expo-blur";
import { ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { styles } from "./User.styles";
import React from "react";
import { Avatar } from "@components/ui";
import { Haptics } from "react-native-nitro-haptics";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function HeaderAvatar({ scrollY }: { scrollY: SharedValue<number> }): React.JSX.Element {
  const { snapEndPosition } = useSettingsScreenStore();
  const isAvatarExpanded = useSharedValue<boolean>(false);

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.get(), [-40, 0, snapEndPosition], [1.4, 1, 0.25], "clamp"),
        },
        { translateY: interpolate(scrollY.get(), [0, snapEndPosition], [0, -30], "clamp") },
      ],
      opacity: interpolate(scrollY.get(), [0, snapEndPosition], [1, 0], "clamp"),
      borderRadius: interpolate(scrollY.get(), [-35, 0], [50 / 1.4, 50], "clamp"),
    })
  );

  const animatedBlurStyle = useAnimatedProps(
    (): BlurViewProps => ({
      intensity: interpolate(scrollY.get(), [0, snapEndPosition], [0, 64], "clamp"),
    })
  );

  // const avatarHapticsTrigger = () => {
  //   Haptics.impact("light");
  // };

  // useAnimatedReaction(
  //   () => isAvatarExpanded.get(),
  //   (prepared, previous) => {
  //     if (prepared) {
  //       runOnJS(avatarHapticsTrigger)();
  //     }
  //   }
  // );

  useAnimatedReaction(
    () => scrollY.get(),
    (prepared, previous) => {
      if (prepared <= -25) {
        isAvatarExpanded.set(true);
      }
    }
  );

  return (
    <Animated.View style={[styles.avatarWrapper, animatedStyle]}>
      <Avatar size='2xl' username='dikiy' style={styles.avatar} />
      <AnimatedBlurView
        tint='dark'
        experimentalBlurMethod='dimezisBlurView'
        animatedProps={animatedBlurStyle}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}
