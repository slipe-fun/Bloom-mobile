import { Button, Icon } from "@components/ui";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { styles } from "./replyBlock.styles";
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from "@constants/animations";
import { useUnistyles } from "react-native-unistyles";
import getChatFromStorage from "@lib/getChatFromStorage";
import { createSecureStorage } from "@lib/storage";
import type { Message } from "@interfaces";

type ReplyBlockProps = {
  message: Message;
  onCancel?: () => void;
  isMe?: boolean
};

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function ReplyBlock({ message, onCancel, isMe }: ReplyBlockProps): React.JSX.Element {
  const { theme } = useUnistyles();
  const [username, setUsername] = useState("");

  useEffect(() => {
    (async () => {
      const storage = await createSecureStorage("user-storage");
      const chat = await getChatFromStorage(message?.chat_id);
      const user = JSON.parse(storage.getString("user"))?.user;
      const username = user?.id === message?.author_id
        ? user?.username
        : chat?.keys?.recipient?.username;
      setUsername(username || "anon");
    })();
  }, [message]);

  return (
    message && (
      <View style={styles.replyWrapper}>
        <Animated.View
          exiting={getFadeOut()}
          entering={getFadeIn()}
          layout={layoutAnimationSpringy}
          style={styles.replyChild(!onCancel, isMe)}
        >
          <View style={styles.replyTo}>
            <Text style={styles.replyToName} numberOfLines={1}>
              В ответ {username}
            </Text>
            <Text style={styles.replyToMessage} numberOfLines={1}>
              {message?.content}
            </Text>
          </View>
          {onCancel && (
            <AnimatedButton
              onPress={() => onCancel()}
              layout={layoutAnimationSpringy}
              variant='icon'
              style={styles.button}
            >
              <Icon color={theme.colors.secondaryText} icon='star' />
            </AnimatedButton>
          )}
        </Animated.View>
      </View>
    )
  );
}
