import React from "react";
import { View } from "react-native";
import { styles } from "./Email.styles";
import AuthTitleTemplate from "@components/auth/titleTemplate";
import AuthEmailInput from "@components/auth/email/Input";
import { ActionText } from "@components/ui";


export default function SignUpEmail(): React.JSX.Element {

	return (
		<View style={styles.container}>
			<AuthTitleTemplate image={require("@assets/emojiIcons/envelope.webp")} title='Введите почту' />
            <AuthEmailInput/>
            <ActionText children="После этого мы отправим 6-значный код подтверждения на вашу почту"/>
		</View>
	);
}
