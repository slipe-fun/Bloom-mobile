import Header from "@components/chatsScreen/header";
import useInsets from "@hooks/UseInsets";
import decrypt from "@lib/skid/decrypt";
import encrypt from "@lib/skid/encrypt";
import generateKeys from "@lib/skid/generateKeys";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function PromocodeScreen() {
	const insets = useInsets();

	(async () => {
		try {
			const bobKeys = await generateKeys();
			const aliceKeys = await generateKeys();

			const encrypted = await encrypt("hello, world from skid protocol", {id: 1, ...bobKeys}, {id: 2, ...aliceKeys});
			const decrypted = await decrypt(encrypted, {id: 2, ...aliceKeys}, {id: 1, ...bobKeys}, false);

			console.log(decrypted)
		} catch (error) {
			console.log(error)
		}
	})()

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
