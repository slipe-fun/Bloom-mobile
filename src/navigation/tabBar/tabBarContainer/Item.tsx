import React, { useEffect } from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, { interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { quickSpring } from "@constants/easings";
import Icon from "@components/ui/Icon";
import { styles } from "./TabBarContainer.styles";
import useTabBarStore from "@stores/tabBar";
import { springyTabBar } from "@constants/animations";

type TabBarItemProps = {
	route: { name: "tab_chats" | "tab_search" | "tab_settings" };
	focused: boolean;
	onPress: () => void;
};

const TAB_ICONS = {
	tab_chats: "message",
	tab_search: "compass",
	tab_settings: "gear",
} as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabBarItem({ route, focused, onPress }: TabBarItemProps): React.JSX.Element {
	const { theme } = useUnistyles();
	const color = useSharedValue(0.35);
	const scale = useSharedValue(1);
	const { isSearch, setIsSearch } = useTabBarStore();

	const tabColor = {
		tab_chats: theme.colors.primary,
		tab_search: theme.colors.yellow,
		tab_settings: theme.colors.purple,
	}[route.name];

	const iconScale = (out: boolean = false) => {
		scale.value = withSpring(out ? 1 : 1.1, quickSpring);
	};

	const animatedStyle = useAnimatedStyle(
		(): ViewStyle => ({
			transform: [
				{
					scale: withSpring(focused ? scale.value : isSearch ? 0.5 : scale.value, quickSpring),
				},
				{
					translateX: route.name === "tab_search" ? "0%" : withSpring(isSearch ? (route.name === "tab_chats" ? "100%" : "-100%") : "0%", springyTabBar),
				},
			],
			opacity: withSpring(focused ? 1 : isSearch ? 0 : 1, quickSpring),
		})
	);

	const animatedProps = useAnimatedProps(() => ({
		fill: interpolateColor(color.value, [1, 2], [theme.colors.text, tabColor]),
	}));

	useEffect(() => {
		color.value = withSpring(isSearch ? 1 : focused ? 2 : 1, quickSpring);
	}, [focused, isSearch]);

	return (
		<AnimatedPressable
			style={[styles.tabBarItem, animatedStyle]}
			onPress={isSearch ? () => setIsSearch(false) : onPress}
			onPressIn={() => iconScale()}
			onPressOut={() => iconScale(true)}
		>
			<Icon animatedProps={animatedProps} size={30} icon={TAB_ICONS[route.name]} />
		</AnimatedPressable>
	);
}
