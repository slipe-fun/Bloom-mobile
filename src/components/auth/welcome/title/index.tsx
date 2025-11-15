import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { AuthTitles } from "@constants/titles";
import Animated, { interpolateColor, useAnimatedStyle } from "react-native-reanimated";
import { styles } from "./Title.styles";
import { quickSpring } from "@constants/easings";
import { getCharEnter, getCharExit, layoutAnimationSpringy } from "@constants/animations";
import physicsSpring from "@lib/physicSpring";

type AnimatedCharProps = { 
    char: string; 
    index: number; 
    charsCount: number; 
    activeTitleIndex: number 
};

const springyChar = (i: number = 0) => physicsSpring({ mass: quickSpring.mass, duration: 0.35 + i * 0.07, dampingRatio: 0.65 });

function AnimatedChar({ char, index, charsCount, activeTitleIndex }: AnimatedCharProps) {
	const animatedStyle = useAnimatedStyle(() => {
		const t = charsCount > 1 ? index / (charsCount - 1) : 0;

		const currentColor = AuthTitles[activeTitleIndex].color;
		const nextColor = AuthTitles[(activeTitleIndex + 1) % AuthTitles.length].color;

		const color = interpolateColor(t, [0, 1], [currentColor, nextColor]);
		return { color };
	});

	return (
		<Animated.Text
			layout={layoutAnimationSpringy}
			entering={getCharEnter(0, springyChar(index))}
			exiting={getCharExit(0, springyChar(index))}
			style={[styles.char, animatedStyle]}
		>
			{char}
		</Animated.Text>
	);
}

export default function AuthTitle(): React.JSX.Element {
	const [activeTitle, setActiveTitle] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setActiveTitle(prev => (prev + 1) % AuthTitles.length);
		}, 3000);
		return () => clearInterval(id);
	}, []);

	const chars = AuthTitles[activeTitle].title.split("");

	return (
		<View style={styles.titleContainer}>
			{chars.map((char, index) => (
				<AnimatedChar key={`${activeTitle}-${index}`} char={char} index={index} charsCount={chars.length} activeTitleIndex={activeTitle} />
			))}
		</View>
	);
}
