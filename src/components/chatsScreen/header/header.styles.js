import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
	header: {
		position: "absolute",
		top: 0,
		zIndex: 2,
		width: "100%",
		paddingHorizontal: theme.spacing.lg,
		backgroundColor: theme.colors.background,
		paddingBottom: theme.spacing.lg,
        alignItems: "center",
		gap: theme.spacing.lg,
	},
	topHeader: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	button: {
		height: 40,
		width: 40,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: theme.radius.full,
		backgroundColor: theme.colors.foreground,
	}
}));
