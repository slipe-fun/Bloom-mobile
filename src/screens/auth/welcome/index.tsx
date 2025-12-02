import React from "react";
import { View } from "react-native";
import { styles } from "./Welcome.styles";
import AuthTitle from "@components/auth/welcome/title";
import AuthActions from "@components/auth/welcome/actions";
import { useInsets } from "@hooks";

export default function AuthWelcome(): React.JSX.Element {
	const insets = useInsets();

	return (
		<View style={styles.container(52 + insets.bottom)}>
			<AuthTitle/>
			<AuthActions/>
		</View>
	);
}
