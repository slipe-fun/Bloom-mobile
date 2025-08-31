import Header from "@components/chatsScreen/header/Header";
import useInsets from "@hooks/UseInsets";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function PromocodeScreen() {
	const insets = useInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<Header title='Промокод' />
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
}));
