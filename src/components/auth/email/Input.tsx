import React, { useEffect, useMemo, useState } from "react";
import { styles } from "./Input.styles";
import { Icon, Input } from "@components/ui";
import useAuthStore from "@stores/auth";
import parseEmail from "@lib/parseEmail";
import Animated from "react-native-reanimated";
import { zoomAnimationIn, zoomAnimationOut } from "@constants/animations";
import { PROVIDERS_LOGOS } from "@constants/providersLogos";
import { useUnistyles } from "react-native-unistyles";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function AuthEmailInput(): React.JSX.Element {
	const { email, setEmail, setEmailValid } = useAuthStore();
	const { theme } = useUnistyles();
	const [provider, setProvider] = useState<keyof typeof PROVIDERS_LOGOS | "unknown">("unknown");

	const icon = useMemo((): React.JSX.Element | null => {
		if (provider === "unknown") {
			return (
				<AnimatedIcon size={28} icon='at' key='icon-at' color={theme.colors.secondaryText} entering={zoomAnimationIn} exiting={zoomAnimationOut} />
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

	return (
		<Input value={email} setValue={setEmail} maxLength={64} keyboardType='email-address' icon={icon} placeholder='example@gmail.com' size='lg' />
	);
}
