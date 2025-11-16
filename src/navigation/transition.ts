import { interpolate } from "react-native-reanimated";
import { fastSpring } from "@constants/easings";

export const screenTransition = () => ({
  enableTransitions: true,
  gestureEnabled: true,
  gestureDirection: ["horizontal"],
  screenStyleInterpolator: ({ layouts: { screen }, progress, focused }) => {
    "worklet";
    
    const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width], "clamp");
    const opacity = interpolate(progress, [0, 1, 2], [0, 1, 0], "clamp")

    return {
      contentStyle: {
        transform: [{ translateX }],
        overflow: "hidden",
        opacity: opacity,
      },
    };
  },
  transitionSpec: {
    open: fastSpring,
    close: fastSpring,
  },
} as any);
