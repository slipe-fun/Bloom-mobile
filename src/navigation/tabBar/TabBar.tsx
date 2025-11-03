import { useInsets } from "@hooks";
import TabBarItem from "./Item";
import { View } from "react-native";
import { styles } from "./tabBar.styles";
import TabBarIndicator from "./Indicator";
import { GradientBlur } from "@components/ui";
import { Haptics } from "react-native-nitro-haptics";
import useTabBarStore from "@stores/tabBar";

export default function TabBar({ state, navigation }) {
	const insets = useInsets();
	const { setTabBarHeight } = useTabBarStore();

	return (
		<View
			onLayout={(e) => setTabBarHeight(e.nativeEvent.layout.height)}
			style={[styles.tabBar, { paddingBottom: insets.bottom }]}
		>
			<GradientBlur/>
			<TabBarIndicator index={state.index} count={state.routes.length} />
			{state.routes.map((route, index) => {
				const focused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!focused && !event.defaultPrevented) {
						Haptics.impact("light");
						navigation.navigate(route.name);
					}
				};

				return <TabBarItem key={route.key} route={route} focused={focused} onPress={onPress} />;
			})}
		</View>
	);
}
