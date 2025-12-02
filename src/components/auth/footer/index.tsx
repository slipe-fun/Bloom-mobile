import React, { useEffect } from "react";
import { Button, Icon } from "@components/ui";
import { ROUTES } from "@constants/routes";
import { styles } from "./Footer.styles";
import { useInsets } from "@hooks";
import { useUnistyles } from "react-native-unistyles";
import useAuthStore from "@stores/auth";
import Animated, { useAnimatedStyle, interpolateColor, interpolate, withSpring, useSharedValue } from "react-native-reanimated";
import { quickSpring } from "@constants/easings";
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from "@constants/animations";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import axios from "axios";
import { API_URL } from "@constants/Api";
import useStorageStore from "@stores/storage";

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function AuthFooter({ navigation }): React.JSX.Element {
	const insets = useInsets();
	const { theme } = useUnistyles();
	const { index, email, emailValid, otp, setError, password } = useAuthStore();
	const progress = useSharedValue(0);
	const { progress: progressKeyboard, height } = useReanimatedKeyboardAnimation();
	const labelProgress = useSharedValue(1);
	const { mmkv } = useStorageStore();

	const navigateMap = [
		() => navigation.navigate(ROUTES.auth.signup.email),
		() => navigation.navigate(ROUTES.auth.signup.otp),
		() => navigation.navigate(ROUTES.auth.signup.password),
	];

	const firstScreen = index === 0;
	const label = firstScreen ? "Продолжить с Почтой" : index === navigateMap.length ? "Завершить" : "Продолжить";

	const disabledMap = [false, !emailValid, otp.length < 6];

	const progMap = [0, emailValid ? 2 : 1, otp.length >= 6 ? 2 : 1, password.length >= 8 ? 2 : 1];

	const onPress = async () => {
		if (index === 0) {
			navigateMap[index]?.();
		} else if (index === 1) {
			const isUserExists = await axios
				.get(API_URL + "/user/exists?email=" + email)
				.then(res => res?.data?.exists)
				.catch(() => undefined);
			if (isUserExists === undefined) return setError("Failed to check is user exists");

			if (isUserExists) {
				axios
					.post(API_URL + "/auth/request-code", { email })
					.catch(console.log);
				navigateMap[index]?.();
			} else {
				const sendRegister = await axios
					.post(API_URL + "/auth/register", { email })
					.then(() => true)
					.catch(error => error?.response?.data || null);
				if (sendRegister?.error) setError("Failed to send register request");
				else if (sendRegister) navigateMap[index]?.();
			}
		} else if (index === 2) {
			const sendVerifyCode = await axios
				.post(API_URL + "/auth/verify-code", { email, code: otp })
				.then(res => res?.data)
				.catch(error => error?.response?.data || null);

			if (sendVerifyCode?.token) {
				navigateMap[index]?.();
				mmkv.set("token", sendVerifyCode?.token);
				mmkv.set("user_id", String(sendVerifyCode?.user?.id));
				mmkv.set("user", JSON.stringify(sendVerifyCode?.user));
			} else console.log("Wrong code");
		}
	};

	const disabled = disabledMap[index] ?? false;
	const progValue = progMap[index];

	const animatedButtonStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(progress.value, [0, 1, 2], [theme.colors.foreground, theme.colors.foreground, theme.colors.primary]),
	}));

	const animatedViewStyle = useAnimatedStyle(
		() => ({
			transform: [{ translateY: height.value }],
			paddingBottom: interpolate(progressKeyboard.value, [0, 1], [insets.bottom, theme.spacing.lg], "clamp"),
		})
	);

	const animatedLabelStyle = useAnimatedStyle(
		() => ({
			color: interpolateColor(labelProgress.value, [0, 1, 2], [theme.colors.text, theme.colors.secondaryText, theme.colors.white]),
		})
	);

	useEffect(() => {
		labelProgress.value = withSpring(progValue, quickSpring);
		progress.value = withSpring(progValue, quickSpring);
	}, [index, emailValid, otp]);

	return (
		<Animated.View style={[styles.footer, animatedViewStyle]}>
			<AnimatedButton
				disabled={disabled}
				onPress={onPress}
				icon={
					firstScreen && (
						<Animated.View entering={getFadeIn()} exiting={getFadeOut()}>
							<Icon key='footerIcon' size={26} color={theme.colors.text} icon='at' />
						</Animated.View>
					)
				}
				size='xl'
				variant='textIcon'
				style={animatedButtonStyle}
			>
				<Animated.View layout={layoutAnimationSpringy} style={styles.partsContainer}>
					{label.split(" ").map((part, i) => (
						<Animated.Text
							key={i}
							entering={getFadeIn()}
							exiting={getFadeOut()}
							layout={layoutAnimationSpringy}
							style={[styles.buttonLabel, animatedLabelStyle]}
						>
							{part}{" "}
						</Animated.Text>
					))}
				</Animated.View>
			</AnimatedButton>
		</Animated.View>
	);
}
