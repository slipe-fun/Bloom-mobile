import React from "react";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { easeGradient } from "react-native-easing-gradient";
import { styles } from "./Footer.styles";
import Animated from "react-native-reanimated";
import { layoutAnimationSpringy } from "@constants/animations";

const { colors, locations } = easeGradient({
  colorStops: {
    1: { color: "rgba(0,0,0,0.99)" },
    0: { color: "transparent" },
    0.5: { color: "black" },
  },
});

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

export default function GradientBlur(): React.JSX.Element {
  return (
    <>
      <MaskedView
        style={styles.blur}
        maskElement={
          <LinearGradient style={styles.blur} locations={locations as any} colors={colors as any} />
        }
      >
        <BlurView style={styles.blur} intensity={20} tint='systemChromeMaterialDark' />
      </MaskedView>
      <AnimatedLinearGradient layout={layoutAnimationSpringy} colors={["rgba(0,0,0, 0)", "rgba(0, 0, 0, 1)"]} style={styles.blur} />
    </>
  );
}
