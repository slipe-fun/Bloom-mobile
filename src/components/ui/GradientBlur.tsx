import React, { useMemo } from "react";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { easeGradient } from "react-native-easing-gradient";
import Animated from "react-native-reanimated";
import { layoutAnimationSpringy } from "@constants/animations";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type GradientDirection = "top-to-bottom" | "bottom-to-top";

interface GradientBlurProps {
  direction?: GradientDirection;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function GradientBlur({ direction = "bottom-to-top" }: GradientBlurProps): React.JSX.Element {
  const { theme } = useUnistyles();

  const { start, end } = useMemo(() => {
    switch (direction) {
      case "top-to-bottom":
        return { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } };
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
      <MaskedView
        style={StyleSheet.absoluteFill}
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
        <BlurView style={StyleSheet.absoluteFill} intensity={20} tint='systemChromeMaterialDark' />
      </MaskedView>

      <AnimatedLinearGradient
        start={start}
        end={end}
        colors={["transparent", theme.colors.background]}
        layout={layoutAnimationSpringy}
        style={StyleSheet.absoluteFill}
      />
    </>
  );
}
