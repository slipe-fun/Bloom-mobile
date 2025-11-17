import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { styles } from "./TitleTemplate.styles";

type TitleTemplateProps = {
	image: ImageSourcePropType;
	title: string;
};

export default function AuthTitleTemplate({ image, title }: TitleTemplateProps): React.JSX.Element {
	return (
		<View style={styles.titleContainer}>
			<Image source={image} style={styles.image} />
			<Text style={styles.title}>{title}</Text>
		</View>
	);
}
