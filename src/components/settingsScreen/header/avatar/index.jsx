import FastImage from "@d11/react-native-fast-image";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import useSettingsScreenStore from "@stores/settingsScreen";

export default function HeaderAvatar({ scrollY }) {
  const { snapEndPosition } = useSettingsScreenStore();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollY.value, [0, snapEndPosition], [1, 40 / 108], "clamp"),
      },
    ],
    opacity: interpolate(scrollY.value, [0, snapEndPosition], [1, 0], "clamp"),
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, snapEndPosition / 2], [0, 1], "clamp"),
  }));

  return (
    <Animated.View style={[animatedStyle, { transformOrigin: "bottom" }]}>
      <FastImage
        source={{
          uri: "https://i.pinimg.com/1200x/39/8e/a1/398ea106afa43c01bd87a8ede3c180a9.jpg",
        }}
        style={[{ width: 108, height: 108, borderRadius: 200 }]}
      />
      <Animated.View style={[animatedCircleStyle, { position: "absolute", bottom: 0, right: 0, left: 0, top: 0, borderRadius: 200, backgroundColor: "#FF9C33" }]} />
    </Animated.View>
  );
}
