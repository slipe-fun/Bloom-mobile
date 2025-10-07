import { CDN_URL } from "@constants/Api";
import { EMOJI_AVATARS } from "@constants/emojiAvatars";
import FastImage, { ImageStyle as FastImageStyle } from "@d11/react-native-fast-image";
import React, { useMemo } from "react";
import { View, StyleProp, Image, ImageStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./Avatar.styles";

type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

type AvatarProps = {
	size?: Size;
	square?: boolean;
	style?: StyleProp<ImageStyle>;
	imageStyle?: StyleProp<FastImageStyle>;
	image?: string;
	username?: string;
};

export default function Avatar({ size = "md", square = false, style, image, imageStyle, username = "" }: AvatarProps): React.ReactNode {
	const { theme } = useUnistyles() as { theme: any };

	const SIZE_MAP: Record<Size, number> = {
		sm: 36,
		md: 40,
		lg: 56,
		xl: 68,
		"2xl": 120,
		"3xl": 128,
	};

	const avatarStyle = useMemo(
		() => [
			{
				aspectRatio: 1,
				height: SIZE_MAP[size],
				borderRadius: square ? theme.radius.md : theme.radius.full,
				padding: image ? 0 : SIZE_MAP[size] / 4.5,
				backgroundColor: image ? theme.colors.foreground : EMOJI_AVATARS[username?.slice(0, 1)].color,
			},
		],
		[size, square, theme, username, image]
	);

	return image ? (
		<FastImage source={{ uri: CDN_URL + image }} style={[avatarStyle, imageStyle]} />
	) : (
		<View style={[avatarStyle, style]}>
			<Image source={EMOJI_AVATARS[username?.slice(0, 1)].emoji} style={styles.emoji} />
		</View>
	);
}
