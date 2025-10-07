import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./Button.styles";

type Size = "sm" | "md" | "lg";
type Variant = "icon" | "text" | "textIcon";

type ButtonProps = {
	ref?: React.Ref<any>;
	variant?: Variant;
	size?: Size;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	icon?: React.ReactNode;
	children?: React.ReactNode;
};

const SIZE_MAP: Record<Size, number> = {
	sm: 36,
	md: 40,
	lg: 44,
};

export default function Button({ ref, variant = "text", size = "md", children, icon, disabled = false, style, ...props }: ButtonProps): React.ReactNode {
	const { theme } = useUnistyles() as { theme: any };

	let paddingHorizontal = 0;
	if (variant !== "icon") {
		switch (size) {
			case "sm":
				paddingHorizontal = theme.spacing.md;
				break;
			case "md":
				paddingHorizontal = theme.spacing.lg;
				break;
			case "lg":
				paddingHorizontal = theme.spacing.xl;
				break;
			default:
				paddingHorizontal = theme.spacing.lg;
		}
	}

	return (
		<Pressable
			style={[
				styles.base,
				{
					height: SIZE_MAP[size],
					aspectRatio: variant === "icon" ? 1 : undefined,
					paddingHorizontal,
					opacity: disabled ? theme.opacity.secondaryText : 1,
				},
				style,
			]}
			ref={ref}
			disabled={disabled}
			{...props}
		>
			{icon}
			{children}
		</Pressable>
	);
}
