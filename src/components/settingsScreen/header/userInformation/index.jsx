import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { styles } from "./userInformation.styles";
import { useUnistyles } from "react-native-unistyles";
import useSettingsScreenStore from "@stores/settingsScreen";

export default function UserInformation({ scrollY }) {
  const { theme } = useUnistyles();
  const { snapEndPosition } = useSettingsScreenStore();

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, snapEndPosition], [0, 0], "clamp") }],
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(scrollY.value, [0, snapEndPosition], [theme.colors.white, theme.colors.text]),
    transform: [
      { scale: interpolate(scrollY.value, [0, snapEndPosition], [1, theme.fontSize.lg / theme.fontSize.xl], "clamp") },
    ],
  }));

  const animatedSubTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(scrollY.value, [0, snapEndPosition], [theme.colors.white, theme.colors.text]),
  }));

  const animatedSubContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, snapEndPosition], [theme.opacity.contentText, theme.opacity.secondaryText], "clamp"),
  }));

  const animatedSubSeparatorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(scrollY.value, [0, snapEndPosition], [theme.colors.white, theme.colors.text]),
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.Text style={[styles.text, animatedStyle]}>
        Duckiy Duckins
      </Animated.Text>
      <Animated.View style={[styles.subContainer, animatedSubContainerStyle]}>
        <Animated.Text style={[styles.subText, animatedSubTextStyle]}>@duckiy</Animated.Text>
        <Animated.View style={[styles.separator, animatedSubSeparatorStyle]} />
        <Animated.Text style={[styles.subText, animatedSubTextStyle]}>ID:500</Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}
