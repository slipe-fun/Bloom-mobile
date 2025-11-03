import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
	header: {
		position: "absolute",
		top: 0,
		zIndex: 2,
		width: "100%",
		paddingHorizontal: theme.spacing.lg,
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
		backgroundColor: 'transparent'
	},
	inView: {
		height: 40,
		width: 40,
	},
	buttonsWrapper: {
		backgroundColor: theme.colors.foregroundBlur,
		borderRadius: theme.radius.full,
		borderCurve: 'continuous',
		position: 'absolute',
		right: 0,
		overflow: 'hidden',
		flexDirection: 'row',
		paddingHorizontal: theme.spacing.xs,
	}
}));
