import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { styles } from "./Header.styles";
import HeaderAvatar from "./avatar";
import { useInsets } from "@hooks";
import useSettingsScreenStore from "@stores/settingsScreen";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import UserInformation from "./userInformation";
import HeaderButtons from "./buttons";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function Header({ scrollY, user }) {
  const insets = useInsets();
  const { setHeaderHeight, snapEndPosition } = useSettingsScreenStore();

  const onHeaderLayout = (e) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  const animatedSvgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, snapEndPosition], [1, 0], "clamp"),
    transform: [{ translateY: interpolate(scrollY.value, [0, snapEndPosition], [0, snapEndPosition / 2], "clamp") }],
  }));

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

      {/* Background gradient based on avatar/user color */}
      <AnimatedSvg style={[styles.background, animatedSvgStyle]}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#FFDAB2" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFB566" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </AnimatedSvg>

      {/* Content */}
      <Animated.View style={[styles.content, { paddingTop: insets.top }, animatedContentStyle]}>
        <HeaderAvatar scrollY={scrollY} />

        <UserInformation scrollY={scrollY} user={user}/>

        <HeaderButtons scrollY={scrollY} />

      </Animated.View>
    </Animated.View>
  );
}
