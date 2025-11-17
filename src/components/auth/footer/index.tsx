import React, { useEffect } from "react";
import { View } from "react-native";
import { Button, Icon } from "@components/ui";
import { ROUTES } from "@constants/routes";
import { styles } from "./Footer.styles";
import { useInsets } from "@hooks";
import { useUnistyles } from "react-native-unistyles";
import useAuthStore from "@stores/auth";
import Animated, { useAnimatedStyle, interpolateColor, withSpring, useSharedValue } from "react-native-reanimated";
import { quickSpring } from "@constants/easings";
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from "@constants/animations";

const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function AuthFooter({ navigation }): React.JSX.Element {
	const insets = useInsets();
	const { theme } = useUnistyles();
	const { index, emailValid } = useAuthStore();
	const progress = useSharedValue(0);
	const labelProgress = useSharedValue(1);

	const firstScreen = index === 0;

	const animatedMailButtonStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(progress.value, [0, 1], [theme.colors.foreground, theme.colors.primary]),
	}));

	const animatedMailLabelStyle = useAnimatedStyle(() => ({
		color: interpolateColor(labelProgress.value, [0, 1, 2], [theme.colors.text, theme.colors.white, theme.colors.secondaryText]),
	}));

	useEffect(() => {
		labelProgress.value = withSpring(firstScreen ? 0 : emailValid ? 1 : 2, quickSpring);
		progress.value = withSpring(firstScreen ? 0 : emailValid ? 1 : 0, quickSpring);
	}, [index, emailValid]);

	return (
		<View style={styles.footer(insets.bottom)}>
			<AnimatedButton
				disabled={firstScreen ? false : !emailValid}
				labelStyle={[styles.buttonLabel, animatedMailLabelStyle]}
				onPress={() => navigation.navigate(ROUTES.auth.signup.email)}
				icon={firstScreen && <AnimatedIcon entering={getFadeIn()} exiting={getFadeOut()} size={28} color={theme.colors.text} icon='at' />}
				label={firstScreen ? "Продолжить с Почтой" : "Продолжить"}
				size='xl'
				variant='textIcon'
				style={animatedMailButtonStyle}
			/>
		</View>
	);
}
