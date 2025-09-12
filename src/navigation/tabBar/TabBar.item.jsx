import { Pressable } from "react-native";
import { styles } from "./TabBar.item.styles";
import Icon from "@components/ui/Icon";
import Animated, { interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";
import { fastSpring } from "@constants/Easings";
import { useUnistyles } from "react-native-unistyles";

const TABS_ICONS = {
	tab_chats: "message",
	tab_search: "compass",
	tab_settings: "gear",
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabBarItem({ route, focused, onPress }) {
	const opacity = useSharedValue(0.5);
	const scale = useSharedValue(1);
	const { theme } = useUnistyles();

	const TABS_COLORS = {
		tab_chats: theme.colors.cyan,
		tab_search: theme.colors.yellow,
		tab_settings: theme.colors.orange,
	};

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ scale: scale.value }],
	}));

	const animatedProps = useAnimatedProps(() => ({
		fill: interpolateColor(opacity.value, [theme.opacity.secondaryText, 1], [theme.colors.text, TABS_COLORS[route.name]]),
	}));

	useEffect(() => {
		opacity.value = withSpring(focused ? 1 : 0.35, fastSpring);
	}, [focused]);

	return (
		<AnimatedPressable
			style={[styles.tabBarItem, animatedStyle]}
			onPress={onPress}
			onPressIn={() => {
				scale.value = withSpring(0.95, fastSpring);
			}}
			onPressOut={() => {
				scale.value = withSpring(1, fastSpring);
			}}
		>
			<Icon animatedProps={animatedProps} color='#000' size={30} icon={TABS_ICONS[route.name]} />
		</AnimatedPressable>
	);
}
