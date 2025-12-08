import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
		backgroundColor: theme.colors.background,
	},
	title: {
		fontSize: theme.fontSize.xxl,
		fontFamily: theme.fontFamily.semibold,
		color: theme.colors.primary,
		marginTop: theme.spacing.sm,
		textAlign: "center",
	},
	subtitle: {
		fontSize: theme.fontSize.md,
		fontFamily: theme.fontFamily.medium,
		color: theme.colors.primaryBackdrop,
		textAlign: "center",
	},
	textWrapper: {
		alignItems: "center",
		paddingHorizontal: theme.spacing.lg,
		justifyContent: "center",
		flex: 1,
		gap: theme.spacing.sm,
	},
	list: {
		flex: 1,
	}
}));
