import { interpolate } from "react-native-reanimated";
import { fastSpring, slowSpring } from "@constants/Easings";
import { Platform } from "react-native";

export const chatTransition = (insets) => ({
  enableTransitions: true,
  gestureEnabled: true,
  gestureDirection: ["horizontal"],
  screenStyleInterpolator: ({ layouts: { screen }, progress, focused }) => {
    "worklet";
    
    const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width], "clamp");

    return {
      overlayStyle: {
        backgroundColor: "rgba(0,0,0,0.85)",
        opacity: focused ? interpolate(progress, [0, 1], [0, 1]) : 0,
      },
      contentStyle: {
        transform: [{ translateX }],
        overflow: "hidden",
      },
    };
  },
  transitionSpec: {
    open: fastSpring,
    close: fastSpring,
  },
});
