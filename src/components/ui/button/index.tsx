import React, { useMemo } from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./Button.styles";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export type Size = "sm" | "md" | "lg" | "xl";
type Variant = "icon" | "text" | "textIcon";

type ButtonProps = {
	ref?: React.Ref<any>;
	variant?: Variant;
	label?: string;
	size?: Size;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	icon?: React.JSX.Element;
	children?: React.ReactNode;
	blur?: boolean;
} & React.ComponentProps<typeof Pressable>;

export const SIZE_MAP: Record<Size, number> = {
	sm: 40,
	md: 44,
	lg: 48,
	xl: 52,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
	ref,
	variant = "text",
	label = "",
	size = "md",
	children,
	icon,
	disabled = false,
	style,
	labelStyle,
	blur = false,
	...props
}: ButtonProps): React.ReactNode {
	const { theme } = useUnistyles();
	const opacity = useSharedValue(1);

	let paddingHorizontal = 0;
	if (variant !== "icon") {
		switch (size) {
			case "sm":
			case "md":
				paddingHorizontal = theme.spacing.lg;
				break;
			case "lg":
			case "xl":
				paddingHorizontal = theme.spacing.xl;
				break;
			default:
				paddingHorizontal = theme.spacing.lg;
		}
	}

	const handlePress = (inn: boolean = true) => {
		opacity.value = withTiming(inn ? 0.85 : 1, { duration: 0.25, easing: Easing.inOut(Easing.ease) });
	};

	const animatedPressabelStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const buttonStyle = useMemo(
		() => styles.button({ size: SIZE_MAP[size], isIcon: variant === "icon", paddingHorizontal, disabled, blur, isTextIcon: variant === "textIcon" }),
		[size, variant, paddingHorizontal, disabled, blur]
	);
	return (
		<AnimatedPressable
			onPressIn={() => handlePress(true)}
			onPressOut={() => handlePress(false)}
			style={[buttonStyle, style, animatedPressabelStyle]}
			ref={ref}
			disabled={disabled}
			{...props}
		>
			{icon}
			{label && <Text style={[styles.label(SIZE_MAP[size]), labelStyle]}>{label}</Text>}
			{children}
		</AnimatedPressable>
	);
}
