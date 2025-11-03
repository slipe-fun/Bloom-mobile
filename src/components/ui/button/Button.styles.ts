import { StyleSheet } from "react-native-unistyles";

type ButtonStyleProps = {
	height: number;
	isIcon: boolean;
	paddingHorizontal: number;
	disabled: boolean;
	blur: boolean
};	

export const styles = StyleSheet.create(theme => ({
	button: ({height, isIcon, paddingHorizontal, disabled, blur}:ButtonStyleProps) => ({
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		height,
		overflow: 'hidden',
		aspectRatio: isIcon ? 1 : undefined,
		paddingHorizontal,	
		opacity: disabled ? theme.opacity.secondaryText : 1,
		borderRadius: theme.radius.lg,
        backgroundColor: blur ? theme.colors.foregroundBlur : theme.colors.foreground,
		minWidth: 36,
	}),
}));
