import React, { useMemo } from "react";
import { View, Text, Pressable as Pressable } from "react-native";
import Animated, { LayoutAnimationConfig } from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import Icon from "@components/ui/Icon";
import { Avatar, Checkbox } from "@components/ui";
import {
  getCharEnter,
  getCharExit,
  getFadeIn,
  getFadeOut,
  layoutAnimationSpringy,
  springyChar,
} from "@constants/animations";
import { styles } from "./Chat.styles";
import type { ChatView } from "@interfaces";
import { useChatItem } from "@hooks";

type ChatProps = {
  chat: ChatView;
  isSearch?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedCheckbox = Animated.createAnimatedComponent(Checkbox);

export default function Chat({ chat, isSearch = false }: ChatProps) {
  const { theme } = useUnistyles();
  const { selected, edit, pinned, openChat, pin, select } = useChatItem(chat);

  const recipient = chat?.recipient;

  const timeChars = useMemo(
    () => (!isSearch ? chat?.lastMessage?.time?.split("") || [] : null),
    [chat?.lastMessage?.time]
  );

  return (
    <AnimatedPressable entering={getFadeIn()} onPress={edit ? select : openChat} style={styles.chat}>
      <LayoutAnimationConfig skipEntering skipExiting>
        {edit && (
          <AnimatedCheckbox entering={getFadeIn()} exiting={getFadeOut()} onTouch={select} value={selected} />
        )}
        <Animated.View layout={layoutAnimationSpringy} style={styles.avatarWrapper}>
          <Avatar size={!isSearch ? "lg" : "md"} image={chat?.avatar} username={recipient?.username} />
        </Animated.View>
        <Animated.View layout={layoutAnimationSpringy} style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>{recipient?.username}</Text>
            </View>

            <Animated.View layout={layoutAnimationSpringy} style={styles.metaRow}>
              {!isSearch && (
                <View style={styles.charStack}>
                  {timeChars.map((char, i) => (
                    <Animated.Text
                      key={`${char}-${i}`}
                      style={styles.secondary}
                      entering={getCharEnter(springyChar(i))}
                      exiting={getCharExit(springyChar(i))}
                      layout={layoutAnimationSpringy}
                    >
                      {char}
                    </Animated.Text>
                  ))}
                </View>
              )}
              <Icon icon='chevron.right' size={16} color={theme.colors.secondaryText} />
            </Animated.View>
          </View>

          {!isSearch ? (
            <Animated.Text
              entering={getCharEnter()}
              exiting={getCharExit()}
              key={chat?.lastMessage.content}
              style={styles.secondary}
              numberOfLines={2}
            >
              {chat?.lastMessage.content}
            </Animated.Text>
          ) : (
            <Text style={styles.secondary}>@{recipient?.username}</Text>
          )}
        </Animated.View>
      </LayoutAnimationConfig>
    </AnimatedPressable>
  );
}
