import useInsets from "@hooks/UseInsets";
import TabBarItem from "./TabBar.item";
import { View } from "react-native";
import useNavigationStore from "@stores/Navigation";
import { styles } from "./TabBar.styles";
import TabBarIndicator from "./TabBar.indicator";

export default function TabBar({ state, navigation }) {
	const insets = useInsets();
	const { setBottomOffset } = useNavigationStore();

	return (
		<View
			style={[styles.tabBar, { paddingBottom: insets.bottom }]}
			onLayout={e => {
				const h = e.nativeEvent.layout.height;
				setBottomOffset(h);
			}}
		>
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
						navigation.navigate(route.name);
					}
				};

				return <TabBarItem key={route.key} route={route} focused={focused} onPress={onPress} />;
			})}
		</View>
	);
}
