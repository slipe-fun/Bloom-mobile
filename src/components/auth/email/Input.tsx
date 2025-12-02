import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "./Input.styles";
import { Icon, Input } from "@components/ui";
import useAuthStore from "@stores/auth";
import parseEmail from "@lib/parseEmail";
import Animated from "react-native-reanimated";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { PROVIDERS_LOGOS } from "@constants/providersLogos";
import { useUnistyles } from "react-native-unistyles";
import { TextInput } from "react-native";

export default function AuthEmailInput(): React.JSX.Element {
	const { email, setEmail, setEmailValid, index } = useAuthStore();
	const { theme } = useUnistyles();
	const ref = useRef<TextInput>(null);
	const [provider, setProvider] = useState<keyof typeof PROVIDERS_LOGOS | "unknown">("unknown");

	const icon = useMemo((): React.JSX.Element | null => {
		if (provider === "unknown") {
			return (
				<Animated.View entering={zoomAnimationIn} exiting={zoomAnimationOut}>
				<Icon size={26} icon='at' key='icon-at' color={theme.colors.secondaryText} />
				</Animated.View>
			);
		} else {
			if (provider in PROVIDERS_LOGOS) {
				return (
					<Animated.Image
						source={PROVIDERS_LOGOS[provider]}
						style={styles.logoIcon}
						key='image-provider'
						entering={zoomAnimationIn}
						exiting={zoomAnimationOut}
					/>
				);
			}
		}
	}, [provider]);

	useEffect(() => {
		const { valid, provider } = parseEmail(email);
		setEmailValid(valid);
		setProvider(provider);
	}, [email, setEmailValid]);

	useEffect(() => {
		ref.current?.blur();
	}, [index])

	return (
		<Input ref={ref} value={email} setValue={setEmail} maxLength={64} keyboardType='email-address' icon={icon} placeholder='example@gmail.com' size='lg' />
	);
}
