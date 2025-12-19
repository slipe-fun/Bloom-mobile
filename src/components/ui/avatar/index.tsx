import { CDN_URL } from "@constants/api";
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
	image?: string | undefined;
	username?: string;
	ref?: React.Ref<any>
};

export default function Avatar({ size = "md", square = false, style, image, imageStyle, username = "", ref = null }: AvatarProps): React.ReactNode {
	const { theme } = useUnistyles();

	const SIZE_MAP: Record<Size, number> = {
		sm: 40,
		md: 44,
		lg: 52,
		xl: 68,
		"2xl": 120,
		"3xl": 128,
	};

	const avatarStyle = useMemo(
		() => styles.avatar({ height: SIZE_MAP[size], square, image: !!image, padding: SIZE_MAP[size] / 4.5, backgroundColor: EMOJI_AVATARS[username?.slice(0, 1)]?.color }),
		[size, square, theme, username, image]
	);

	return image ? (
		<View ref={ref}>
			<FastImage source={{ uri: image }} style={[avatarStyle, imageStyle]} />
		</View>
	) : (
		<View ref={ref} style={[avatarStyle, style]}>
			<Image source={EMOJI_AVATARS[username?.slice(0, 1)]?.emoji} style={styles.emoji} />
		</View>
	);
}
