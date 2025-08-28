import Svg, { Path } from "react-native-svg";
import { ICONS } from "@constants/Icons";
import Animated from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function Icon({ size = 24, color = "white", icon = "", style, animatedProps }) {
	const pathData = ICONS[icon] || "";
    

	return (
		<Svg style={style} width={size} height={size} viewBox='0 0 24 24' fill='none'>
			{animatedProps ? <AnimatedPath animatedProps={animatedProps} fill={color} d={pathData} /> : <Path fill={color} d={pathData} />}
		</Svg>
	);
}
