import { View, Text } from "react-native";
import { styles } from "./header.styles";
import useInsets from "@hooks/UseInsets";
import { useState } from "react";
import { interpolate, useAnimatedStyle } from "react-native-reanimated";

export default function Header({ scrollY }) {
	const insets = useInsets();
	const [headerHeight, setHeaderHeight] = useState(0);

	return (
		<View
			onLayout={e => {
				const h = e.nativeEvent.layout.height;
				setHeaderHeight(h);
			}}
			style={[styles.header, { paddingTop: insets.top }]}
		>
			<View>
				<Text style={styles.afterScrollTitle}>Сообщения</Text>
			</View>
		</View>
	);
}
