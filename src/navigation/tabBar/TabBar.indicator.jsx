import { useEffect, useRef } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor } from "react-native-reanimated";
import { fastSpring } from "@constants/easings";
import { useInsets } from "@hooks";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./TabBar.indicator.styles";
import physicsSpring from "@lib/physicSpring";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabBarIndicator({ index = 0, count = 3 }) {
	const x = useSharedValue(0);
	const scaleX = useSharedValue(1);
	const colorProgress = useSharedValue(index);
	const prevIndex = useRef(index);
	const insets = useInsets();
	const { width } = useWindowDimensions();
	const { theme } = useUnistyles();

	const TABS_COLORS = [theme.colors.cyan, theme.colors.yellow, theme.colors.orange];

	const calculatedWidth = width - 32;
	const tabWidth = calculatedWidth / count;
	const indicatorWidth = tabWidth - 32;

	const swag = physicsSpring({ mass: fastSpring.mass, duration: 0.25, dampingRatio: 0.7})

	useEffect(() => {
		if (!calculatedWidth || count <= 0) return;
		const target = tabWidth * index + (tabWidth - indicatorWidth) / 2;

		const direction = index > prevIndex.current ? 1 : -1;
		prevIndex.current = index;

		x.value = withSpring(target, swag);

		scaleX.value = withSpring(1 + 0.2 * direction, swag, () => {
			scaleX.value = withSpring(1, swag);
		});

		colorProgress.value = withSpring(index, swag);
	}, [index, calculatedWidth, count]);

	const style = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: x.value }, { scaleX: scaleX.value }],
			backgroundColor: interpolateColor(
				colorProgress.value,
				TABS_COLORS.map((_, i) => i),
				TABS_COLORS
			),
		};
	});

	return <AnimatedView style={[style, { width: indicatorWidth, bottom: insets.bottom }, styles.indicator]} />;
}
