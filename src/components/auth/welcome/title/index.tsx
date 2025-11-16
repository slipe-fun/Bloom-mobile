import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { AUTH_TITLES } from "@constants/titles";
import Animated from "react-native-reanimated";
import { styles } from "./Title.styles";
import { quickSpring } from "@constants/easings";
import { getCharEnter, getCharExit, layoutAnimationSpringy } from "@constants/animations";
import physicsSpring from "@lib/physicSpring";

const springyChar = (i: number = 0) => physicsSpring({ mass: quickSpring.mass, duration: 0.35 + i * 0.07, dampingRatio: 0.65 });

export default function AuthTitle(): React.JSX.Element {
	const [activeTitle, setActiveTitle] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setActiveTitle(prev => (prev + 1) % AUTH_TITLES.length);
		}, 3000);
		return () => clearInterval(id);
	}, []);

	const chars = AUTH_TITLES[activeTitle].title.split("");

	return (
		<View style={styles.titleContainer}>
			{chars.map((char, index) => (
				<Animated.Text
				    key={`${char}-${Math.random()}`}
					layout={layoutAnimationSpringy}
					entering={getCharEnter(0, springyChar(index))}
					exiting={getCharExit(0, springyChar(index))}
					style={styles.char}
				>
					{char}
				</Animated.Text>
			))}
		</View>
	);
}
