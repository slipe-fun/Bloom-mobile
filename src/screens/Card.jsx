import Header from "@components/chatsScreen/header/header";
import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native-unistyles";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

const data = Array.from({ length: 100 }).map((_, i) => ({ id: i.toString() }));

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export default function CardScreen() {
	const scrollY = useSharedValue(0);
	const renderItem = () => {
		return <Text>1</Text>;
	};

	const onscroll = useAnimatedScrollHandler(event => {
		scrollY.value = event.contentOffset.y;
	});

	return (
		<View style={styles.container}>
			<Header scrollY={scrollY} /> 
			<AnimatedFlashList
				onScroll={onscroll}
				estimatedItemSize={100}
				data={data}
                contentContainerStyle={styles.list}
				renderItem={() => renderItem()}
			/>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
    list: {
        paddingHorizontal: theme.spacing.lg,
    }
}));
