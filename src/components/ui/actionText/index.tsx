import React from "react";
import { styles } from "./ActionText.styles";
import { Text, GestureResponderEvent, TextProps } from "react-native";

type ActionTextProps = Omit<TextProps, "children"> & {
	children: string;
	actionText?: string;
	onPress?: (event: GestureResponderEvent) => void;
};

export default function ActionText({ children, actionText, onPress, style, ...props }: ActionTextProps) {
	if (!actionText) {
		return <Text style={styles.text}>{children}</Text>;
	}

	const parts = children.split(actionText);

	return (
		<Text style={[styles.text, style]} {...props}>
			{parts[0]}
			<Text style={[styles.actionText, style]} onPress={onPress}>
				{actionText}
			</Text>
			{parts[1]}
		</Text>
	);
}
