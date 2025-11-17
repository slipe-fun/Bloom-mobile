import React, { useMemo } from "react";
import { View, TextInput, StyleProp, ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./Input.styles";

type Size = "sm" | "md" | "lg";

type InputProps = {
	size?: Size;
	setValue?: (value: string) => void;
	value?: string;
	ref?: React.Ref<any>;
	viewStyle?: StyleProp<ViewStyle>;
	style?: StyleProp<ViewStyle>;
	icon?: React.ReactNode;
	button?: React.ReactNode;
	disabled?: boolean;
} & React.ComponentProps<typeof TextInput>;

const SIZE_MAP: Record<Size, number> = {
	sm: 40,
	md: 44,
	lg: 48,
};

export default function Input({ size, setValue, value, ref, viewStyle, style, icon, button, disabled, ...props }: InputProps): React.JSX.Element {
	const { theme } = useUnistyles();

	const viewStyleMemo = useMemo(() => styles.inputWrapper({ height: SIZE_MAP[size], disabled }), [size]);

	return (
		<View style={[viewStyle, viewStyleMemo]}>
			{icon && <View style={styles.iconWrapper}>{icon}</View>}

			<TextInput
				ref={ref}
				cursorColor={theme.colors.secondaryText}
				selectionColor={theme.colors.secondaryText}
				keyboardAppearance='dark'
				value={value}
				placeholderTextColor={theme.colors.secondaryText}
				onChangeText={setValue}
				style={[styles.input(!!icon), style]}
				{...props}
			/>
			{button}
		</View>
	);
}
