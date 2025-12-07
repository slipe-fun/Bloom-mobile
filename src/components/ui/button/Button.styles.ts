import { StyleSheet } from "react-native-unistyles";
import { SIZE_MAP } from ".";

type ButtonStyleProps = {
	size: number;
	isIcon: boolean;
	paddingHorizontal: number;
	blur: boolean;
	isTextIcon: boolean;
};

export const styles = StyleSheet.create(theme => ({
	button: ({ size, isIcon, paddingHorizontal, blur, isTextIcon }: ButtonStyleProps) => ({
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		height: size,
		width: size > SIZE_MAP['lg'] ? "100%" : "auto",
		overflow: "hidden",
		aspectRatio: isIcon ? 1 : undefined,
		paddingHorizontal,
		borderCurve: 'continuous',
		borderRadius: theme.radius.full,
		backgroundColor: blur ? theme.colors.foregroundBlur : theme.colors.foreground,
		gap: isTextIcon ? theme.spacing.md : 0,
	}),
	label: (size: number) => ({
		color: theme.colors.text,
		fontSize: size >= SIZE_MAP['lg'] ? theme.fontSize.lg : theme.fontSize.md,
		fontFamily: theme.fontFamily.medium,
	}),
}));
