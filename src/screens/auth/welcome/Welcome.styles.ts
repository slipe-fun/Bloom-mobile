import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
	container: (paddingBottom: number) => ({
		flex: 1,
        justifyContent: 'flex-end',
		paddingBottom,
	}),
}));
