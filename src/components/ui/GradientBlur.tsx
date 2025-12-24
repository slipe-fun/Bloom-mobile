import React, { useMemo } from "react";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { easeGradient } from "react-native-easing-gradient";
import Animated from "react-native-reanimated";
import { layoutAnimationSpringy } from "@constants/animations";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Platform, StyleProp, ViewStyle } from "react-native";

type GradientDirection = "top-to-bottom" | "bottom-to-top" | "bottom-left-to-top-right";

type GradientBlurProps = {
  direction?: GradientDirection;
  ref?: React.Ref<MaskedView>;
  style?: StyleProp<ViewStyle>;
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function GradientBlur({
  direction = "bottom-to-top",
  ref,
  style,
}: GradientBlurProps): React.JSX.Element {
  const { theme } = useUnistyles();

  const { start, end } = useMemo(() => {
    switch (direction) {
      case "top-to-bottom":
        return { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } };
      case "bottom-left-to-top-right":
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
      case "bottom-to-top":
      default:
        return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } };
    }
  }, [direction]);

  const { colors, locations } = useMemo(
    () =>
      easeGradient({
        colorStops: {
          0: { color: "transparent" },
          0.5: { color: theme.colors.background },
          1: { color: theme.colors.background },
        },
      }),
    [theme.colors.background]
  );

  return (
    <>
      {Platform.OS !== "android" && (
        <MaskedView
          ref={ref}
          style={[StyleSheet.absoluteFill, style]}
          maskElement={
            <LinearGradient
              start={start}
              end={end}
              locations={locations as any}
              colors={colors as any}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <BlurView style={StyleSheet.absoluteFill} intensity={16} tint='systemChromeMaterialDark' />
        </MaskedView>
      )}

      <AnimatedLinearGradient
        start={start}
        end={end}
        colors={["transparent", theme.colors.gradientBlur]}
        layout={layoutAnimationSpringy}
        style={[StyleSheet.absoluteFill, style]}
      />
    </>
  );
}
