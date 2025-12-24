import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import { styles } from "./User.styles";
import { useUnistyles } from "react-native-unistyles";
import useSettingsScreenStore from "@stores/settingsScreen";
import { TextStyle, ViewStyle } from "react-native";

export default function UserInformation({ scrollY, user }): React.JSX.Element {
  const { theme } = useUnistyles();
  const { snapEndPosition } = useSettingsScreenStore();

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, snapEndPosition], [1, 0]),
  }));

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [0, snapEndPosition],
            [1, theme.fontSize.lg / (theme.fontSize.xxl - 2)],
            "clamp"
          ),
        },
      ],
    })
  );

  const animatedSubTextStyle = useAnimatedStyle(
    (): TextStyle => ({
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, snapEndPosition],
            [0, -(theme.fontSize.xxl - 2 - theme.fontSize.lg)],
            "clamp"
          ),
        },
        { scale: interpolate(scrollY.value, [0, snapEndPosition], [1, 0.85], "clamp") },
      ],
    })
  );

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.Text style={[styles.name, animatedStyle]}>
        {/* {user?.display_name || user?.username} */} Dikiy Boss
      </Animated.Text>
      {/* <Animated.Text style={[styles.mail, animatedSubTextStyle]}>@{user?.username}</Animated.Text> */}
      <Animated.Text style={[styles.mail, animatedSubTextStyle]}>dikiyboss@hotmail.com</Animated.Text>
    </Animated.View>
  );
}
