import { StyleSheet } from "react-native-unistyles";

type ButtonStyleProps = {
	height: number;
	isIcon: boolean;
	paddingHorizontal: number;
	disabled: boolean;
};	

export const styles = StyleSheet.create(theme => ({
	button: ({height, isIcon, paddingHorizontal, disabled}:ButtonStyleProps) => ({
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		height,
		aspectRatio: isIcon ? 1 : undefined,
		paddingHorizontal,	
		opacity: disabled ? theme.opacity.secondaryText : 1,
		borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.foreground,
		minWidth: 36,
	}),
}));
