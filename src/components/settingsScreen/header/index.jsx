import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { styles } from "./Header.styles";
import HeaderAvatar from "./avatar";
import { useInsets } from "@hooks";
import useSettingsScreenStore from "@stores/settingsScreen";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import UserInformation from "./userInformation";
import HeaderButtons from "./buttons";
import { GradientBlur } from "@components/ui";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function Header({ scrollY, user }) {
  const insets = useInsets();
  const { setHeaderHeight, snapEndPosition } = useSettingsScreenStore();

  const onHeaderLayout = (e) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    borderBottomLeftRadius: interpolate(scrollY.value, [0, snapEndPosition], [38, 0], "clamp"),
    borderBottomRightRadius: interpolate(scrollY.value, [0, snapEndPosition], [38, 0], "clamp"),
    transform: [{ translateY: interpolate(scrollY.value, [0, snapEndPosition], [0, -snapEndPosition], "clamp") }],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [snapEndPosition - 44, snapEndPosition], [0, 16], "clamp") }],
  }));

  return (
    <Animated.View onLayout={onHeaderLayout} style={[styles.header, animatedHeaderStyle]}>
      <GradientBlur direction="top-to-bottom"/>
      {/* Content */}
      <Animated.View style={[styles.content, { paddingTop: insets.top }, animatedContentStyle]}>
        <HeaderAvatar scrollY={scrollY} />

        <UserInformation scrollY={scrollY} user={user}/>

      </Animated.View>
    </Animated.View>
  );
}
