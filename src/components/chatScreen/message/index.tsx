import React from "react";
import { Pressable } from "react-native";
import { styles } from "./Message.styles";
import Animated, { LayoutAnimationConfig } from "react-native-reanimated";
import type { Message } from "@interfaces";
import MessageBubble from "./MessageBubble";
import MessageStatus from "./MessageStatus";
import { getFadeIn } from "@constants/animations";

type MessageProps = {
	message: Message | null;
	seen?: boolean;
	isLast?: boolean;
	isGroupStart?: boolean,
	isGroupEnd?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Message({ message, seen, isLast, isGroupStart, isGroupEnd }: MessageProps): React.JSX.Element {

	return (
		<AnimatedPressable
			entering={getFadeIn()}
			style={[styles.messageWrapper(message?.isMe)]}
		>
			<MessageBubble message={message} />
			<LayoutAnimationConfig skipEntering skipExiting>
				<MessageStatus message={message} isLast={isLast} seen={seen} />
			</LayoutAnimationConfig>
		</AnimatedPressable>
	);
}
