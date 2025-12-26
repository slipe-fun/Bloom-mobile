import React, { useEffect, useRef } from "react";
import { ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor } from "react-native-reanimated";
import { useInsets } from "@hooks";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./TabBarContainer.styles";
import { springyTabBar } from "@constants/animations";
import useTabBarStore from "@stores/tabBar";

type TabBarIndicatorProps = {
	index?: number;
	count?: number;
};

export default function TabBarIndicator({ index = 0, count = 3 }: TabBarIndicatorProps): React.JSX.Element {
	const insets = useInsets();
	const { theme } = useUnistyles();
	const prevIndex = useRef(index);
	const { isSearch } = useTabBarStore();

	const x = useSharedValue(0);
	const scaleX = useSharedValue(1);
	const scaleY = useSharedValue(1);
	const colorProgress = useSharedValue(0);

	const tabWidth = 70;
	const colors = [theme.colors.primaryBackdrop, theme.colors.yellowBackdrop, theme.colors.pinkBackdrop
		
	]

	useEffect(() => {
		if (count <= 0) return;

		const target = tabWidth * index;
		prevIndex.current = index;

		x.value = withSpring(target, springyTabBar);

		scaleX.value = withSpring(1 + 0.2, springyTabBar, () => {
			scaleX.value = withSpring(1, springyTabBar);
		});

		scaleY.value = withSpring(0.875, springyTabBar, () => {
			scaleY.value = withSpring(1, springyTabBar);
		});

		colorProgress.value = withSpring(index, springyTabBar)
	}, [index, count]);

	const animatedStyle = useAnimatedStyle(
		(): ViewStyle => ({
			transform: [
				{ translateX: x.value },
				{ scaleX: scaleX.value },
				{ scaleY: scaleY.value },
				{ scale: withSpring(isSearch ? 0.5 : 1, springyTabBar) },
			],
			opacity: withSpring(isSearch ? 0 : 1, springyTabBar),
			backgroundColor: interpolateColor(colorProgress.value, colors.map((_, i) => i), colors)
		})
	);

	return <Animated.View style={[styles.indicator, animatedStyle, { width: tabWidth, bottom: insets.bottom }]} />;
}
