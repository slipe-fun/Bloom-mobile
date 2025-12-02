import React from "react";
import { styles } from "./Password.styles";
import AuthTitleTemplate from "@components/auth/titleTemplate";
import { ActionText, Input } from "@components/ui";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useInsets } from "@hooks";
import AuthPasswordInput from "@components/auth/password/PasswordInput";
import AuthNickInput from "@components/auth/password/NickInput";

export default function SignupPassword(): React.JSX.Element {
	const keyboard = useReanimatedKeyboardAnimation();
	const insets = useInsets();

	const animatedStyles = useAnimatedStyle(() => {
	  return { transform: [{ translateY: ( keyboard.height.value + insets.top) / 2 }] };
	});

	return (
		<Animated.View style={[styles.container(84 + insets.bottom), animatedStyles]}>
			<AuthTitleTemplate icon="lock" title='Пароль и ник' />
            <AuthPasswordInput/>
			<AuthNickInput/>
            <ActionText actionText="синхранизации ключей" children="Пароль должен состоять из 8-64 любых символов. Он используется для"/>
		</Animated.View>
	);
}


