import { useInsets } from "@hooks";
import TabBarItem from "./Item";
import { Pressable, View } from "react-native";
import { styles } from "./TabBar.styles";
import TabBarIndicator from "./Indicator";
import { GradientBlur } from "@components/ui";
import { Haptics } from "react-native-nitro-haptics";
import useTabBarStore from "@stores/tabBar";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import TabBarSearchButton from "./SearchButton";
import { springyTabBar } from "@constants/animations";

export default function TabBar({ state, navigation }) {
	const insets = useInsets();
	const { setTabBarHeight, isSearch } = useTabBarStore();

	const animatedViewStyle = useAnimatedStyle(() => ({
		height: withSpring(isSearch ? 48 : 54, springyTabBar),
	}));

	return (
		<View onLayout={e => setTabBarHeight(e.nativeEvent.layout.height)} style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
			<GradientBlur />
			<Animated.View style={[styles.tabBar, animatedViewStyle]}>
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
			</Animated.View>
			<TabBarSearchButton />
		</View>
	);
}
