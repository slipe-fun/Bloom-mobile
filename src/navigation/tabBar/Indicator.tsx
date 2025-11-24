import React, { useEffect, useRef } from "react";
import { ViewStyle, useWindowDimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useInsets } from "@hooks";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./TabBar.styles";
import { springyTabBar } from "@constants/animations";
import useTabBarStore from "@stores/tabBar";

type TabBarIndicatorProps = {
	index?: number;
	count?: number;
};

export default function TabBarIndicator({ index = 0, count = 3 }: TabBarIndicatorProps): React.JSX.Element {
	const { width } = useWindowDimensions();
	const insets = useInsets();
	const { theme } = useUnistyles();
	const prevIndex = useRef(index);
	const { isSearch } = useTabBarStore();

	const x = useSharedValue(0);
	const scaleX = useSharedValue(1);
	const scaleY = useSharedValue(1);

	const tabWidth = (width - theme.spacing.xxxl * 2 - theme.spacing.xs * 2 - (54 + theme.spacing.md)) / count;

	useEffect(() => {
		if (count <= 0) return;

		const target = tabWidth * index;
		const direction = Math.sign(index - prevIndex.current) || 1;
		prevIndex.current = index;

		x.value = withSpring(target, springyTabBar);

		scaleX.value = withSpring(1 + 0.2 * direction, springyTabBar, () => {
			scaleX.value = withSpring(1, springyTabBar);
		});

		scaleY.value = withSpring(0.9, springyTabBar, () => {
			scaleY.value = withSpring(1, springyTabBar);
		});
	}, [index, count, tabWidth]);

	const animatedStyle = useAnimatedStyle(
		(): ViewStyle => ({
			transform: [
				{ translateX: x.value },
				{ scaleX: scaleX.value },
				{ scaleY: scaleY.value },
				{ scale: withSpring(isSearch ? 0.5 : 1, springyTabBar) },
			],
			opacity: withSpring(isSearch ? 0 : 1, springyTabBar),
		})
	);

	return <Animated.View style={[styles.indicator, animatedStyle, { width: tabWidth, bottom: insets.bottom }]} />;
}
