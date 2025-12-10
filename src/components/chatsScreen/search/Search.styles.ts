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
	list: {
		flex: 1,
	}
}));
