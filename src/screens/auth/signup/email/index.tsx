import React from "react";
import { styles } from "./Email.styles";
import AuthTitleTemplate from "@components/auth/titleTemplate";
import AuthEmailInput from "@components/auth/email/Input";
import { ActionText } from "@components/ui";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useInsets } from "@hooks";

export default function SignupEmail(): React.JSX.Element {
	const keyboard = useReanimatedKeyboardAnimation();
	const insets = useInsets();

	const animatedStyles = useAnimatedStyle(() => {
	  return { transform: [{ translateY: ( keyboard.height.value + insets.top) / 2 }] };
	});

	return (
		<Animated.View style={[styles.container(52 + insets.bottom), animatedStyles]}>
			<AuthTitleTemplate icon="at" title='Введите почту' />
            <AuthEmailInput/>
            <ActionText children="После этого мы отправим 6-значный код подтверждения на вашу почту"/>
		</Animated.View>
	);
}


