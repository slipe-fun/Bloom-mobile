import { Button } from "@components/ui";
import { Icon, Separator } from "@components/ui";
import { useInsets } from "@hooks";
import React from "react";
import { Image, Platform, View } from "react-native";
import { styles } from "./Actions.styles";
import { useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "@constants/routes";

export default function AuthActions(): React.JSX.Element {
	const insets = useInsets();
	const { theme } = useUnistyles();
	const { navigate } = useNavigation<any>();

	const iOS = Platform.OS === "ios";

    const focusedIcon = iOS ? <Icon size={28} icon='apple.logo' color={theme.colors.background} /> : <Image style={styles.imageIcon} source={require("@assets/logos/google.webp")}/>

	return (
		<View style={styles.actionsContainer(insets.bottom)}>
			<Button
				style={styles.button(true)}
				labelStyle={styles.buttonLabel(true)}
				icon={focusedIcon}
				label={iOS ? "Продолжить с Apple" : "Продолжить с Google"}
				size='xl'
				variant='textIcon'
			/>

			<Separator label='ИЛИ' style={styles.separatorContainer} />

			<Button onPress={() => navigate(ROUTES.auth.signup.email)} icon={<Icon size={28} icon='at' />} label='Продолжить с Почтой' size='xl' variant='textIcon' />
			<Button icon={<Icon size={28} icon='apple.logo' />} label={!iOS ? "Продолжить с Apple" : "Продолжить с Google"} size='xl' variant='textIcon' />
		</View>
	);
}
