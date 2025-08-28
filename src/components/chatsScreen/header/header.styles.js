import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
	header: {
		position: "absolute",
		top: 0,
		width: "100%",
        zIndex: 1,
		backgroundColor: theme.colors.background,
		paddingBottom: theme.spacing.lg,
        alignItems: "center",
	},
    afterScrollTitle: {
		fontSize: theme.fontSize.md,
        lineHeight: theme.lineHeight.md,
		color: theme.colors.text,
		fontFamily: theme.fontFamily.semibold,
	},
}));
