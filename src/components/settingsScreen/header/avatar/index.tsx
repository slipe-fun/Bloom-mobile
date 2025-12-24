import FastImage from "@d11/react-native-fast-image";
import Animated, { interpolate, useAnimatedProps, useAnimatedStyle } from "react-native-reanimated";
import useSettingsScreenStore from "@stores/settingsScreen";
import { BlurView, BlurViewProps } from "expo-blur";
import { ViewStyle } from "react-native";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function HeaderAvatar({ scrollY }) {
  const { snapEndPosition } = useSettingsScreenStore();

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.value, [0, snapEndPosition], [1, 0.25], "clamp"),
        },
        { translateY: interpolate(scrollY.value, [0, snapEndPosition], [0, -30], "clamp") },
      ],
      opacity: interpolate(scrollY.value, [0, snapEndPosition], [1, 0], "clamp"),
      borderRadius: 200,
      overflow: "hidden",
    })
  );

  const animatedBlurStyle = useAnimatedProps(
    (): BlurViewProps => ({
      intensity: interpolate(scrollY.value, [0, snapEndPosition], [0, 64], "clamp"),
    })
  );

  return (
    <Animated.View style={[animatedStyle, { transformOrigin: "bottom" }]}>
      <FastImage
        source={{
          uri: "https://i.pinimg.com/1200x/39/8e/a1/398ea106afa43c01bd87a8ede3c180a9.jpg",
        }}
        style={[{ width: 120, height: 120, borderRadius: 200 }]}
      />
      <AnimatedBlurView
        tint='dark'
        experimentalBlurMethod='dimezisBlurView'
        animatedProps={animatedBlurStyle}
        style={{ width: 120, height: 120, position: "absolute" }}
        intensity={64}
      />
    </Animated.View>
  );
}
