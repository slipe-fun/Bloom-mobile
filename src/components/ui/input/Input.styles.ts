import { StyleSheet } from "react-native-unistyles";

type InputStyleProps = {
	height: number;
	disabled: boolean;
};

export const styles = StyleSheet.create(theme => ({
	inputWrapper: ({ height, disabled }: InputStyleProps) => ({
		width: "100%",
		height,
		backgroundColor: theme.colors.foregroundTransparent,
		borderRadius: theme.radius.full,
		flexDirection: "row",
    opacity: disabled ? theme.opacity.secondaryText : 1,
    pointerEvents: disabled ? 'none' : 'auto',
		alignItems: "center",
	}),
	input: (icon: boolean) => ({
		flex: 1,
		paddingLeft: icon ? theme.spacing.xs : theme.spacing.lg,
		paddingVertical: 10,
		height: "auto",
		color: theme.colors.text,
		fontSize: theme.fontSize.md,
		fontFamily: theme.fontFamily.medium,
		borderWidth: 0,
	}),
  iconWrapper: {
    height: '100%',
    aspectRatio: 1/1,
    justifyContent: 'center',
    alignItems: 'center',
  }
}));
