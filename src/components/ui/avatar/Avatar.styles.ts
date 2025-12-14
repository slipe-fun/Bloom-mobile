import { StyleSheet } from "react-native-unistyles";

type AvatarStyleProps = {
	height: number;
	square: boolean;
	image: boolean;
	padding: number;
	backgroundColor: string;
};

export const styles = StyleSheet.create(theme => ({
	avatar: ({ height, square, image, padding, backgroundColor }: AvatarStyleProps) => ({
		aspectRatio: 1,
		height,
		borderRadius: square ? theme.radius.md : theme.radius.full,
		padding: image ? 0 : padding,
		backgroundColor: image ? theme.colors.foreground : backgroundColor,
	}),
	emoji: {
		width: "100%",
		height: "100%",
	},
}));
