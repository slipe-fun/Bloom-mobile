import Header from "@components/chatScreen/header";
import Footer from "@components/chatScreen/footer";
import Message from "@components/chatScreen/message";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "./Chat.styles";
import { View } from "react-native";
import EmptyModal from "@components/chatScreen/emptyModal";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import useMessages from "@api/hooks/encryption/useMessages";
import { Chat, MessageInterface } from "@interfaces";
import { useScreenScale } from "@hooks";
import { FlashList } from "@shopify/flash-list";

interface ChatScreenProps {
	route: {
		params: Object;
	};
}

export default function ChatScreen({ route }: ChatScreenProps) {
	const { chat } = route.params as { chat: Chat };

	const { messages, addMessage } = useMessages(chat?.id);
	const [seenId, setSeenId] = useState<number>(0);
	const [footerHeight, setFooterHeight] = useState<number>(0);
	const [headerHeight, setHeaderHeight] = useState<number>(0);
	const [lastMessageId, setLastMessageId] = useState<number>(0);
	const { animatedScreenStyle } = useScreenScale();

	useEffect(() => {
		let lastSeen = 0;
		for (let i = messages.length - 1; i >= 0; i--) {
			const m = messages[i];
			if (m?.seen && m?.isMe) {
				lastSeen = m.id;
				break;
			}
		}
		setSeenId(lastSeen);
		setLastMessageId(messages.length ? messages[messages.length - 1]?.id : 0);
	}, [messages.length, messages]);

	const renderItem = useCallback(
		({ item }: { item: MessageInterface }) => {
			return (
				<Message
					key={item?.id}
					seen={seenId === item?.id}
					isLast={lastMessageId === item?.id}
					message={item}
					messagesLenght={messages.length}
					shift={footerHeight}
				/>
			);
		},
		[seenId, lastMessageId, messages.length, footerHeight]
	);

	const keyExtractor = useCallback((item: MessageInterface) => {
		return String(item.id);
	}, []);

	return (
		<View style={[styles.container, animatedScreenStyle]}>
			<Header onLayout={setHeaderHeight} chat={chat} />
			<EmptyModal chat={chat} visible={messages.length === 0} />
			<KeyboardAvoidingView behavior='translate-with-padding' style={styles.list}>
				<FlashList
					data={messages}
					renderItem={renderItem}
					removeClippedSubviews
					keyExtractor={keyExtractor}
					maintainVisibleContentPosition={{
						autoscrollToBottomThreshold: 0.2,
						startRenderingFromBottom: true,
						animateAutoScrollToBottom: false,
					}}
					contentContainerStyle={[styles.listContent, { paddingTop: headerHeight + (footerHeight - 16) }]}
					style={styles.list}
					showsVerticalScrollIndicator={false}
				/>
				<Footer onLayout={setFooterHeight} onSend={addMessage} />
			</KeyboardAvoidingView>
		</View>
	);
}
