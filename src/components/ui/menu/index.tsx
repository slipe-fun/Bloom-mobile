import React from "react";
import { View, Pressable, Text } from "react-native";
import { Portal } from "@gorhom/portal";
import Animated from "react-native-reanimated";
import { BlurView } from "expo-blur";
import Icon from "../Icon";
import { styles } from "./Menu.styles";
import { getFadeIn, getFadeOut, menuFocusAnimationIn, menuFocusAnimationOut, messageFocusAnimationIn, messageFocusAnimationOut } from "@constants/animations";
import type { MessageInterface, Option } from "@interfaces";
import { MessageBubble } from "@components/chatScreen/message";
import { styles as messageStyles } from "@components/chatScreen/message/Message.styles";

type MenuProps = {
  isOpen: boolean;
  position: { top: number; left: number; width: number };
  closeMenu: () => void;
  options: Option[];
  message?: MessageInterface;
  bluredBackdrop?: boolean;
  onSelect?: (value: string) => void;
};

export default function Menu({ isOpen, position, closeMenu, options, message, bluredBackdrop, onSelect }: MenuProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.backdrop}>
        <Pressable onPress={closeMenu} style={styles.backdrop}>
          {bluredBackdrop && <BlurView style={styles.backdrop} intensity={48} tint='dark' />}
        </Pressable>
      </Animated.View>

      <View style={styles.menuWrapper({ top: position.top, open: isOpen })}>
         {message && (
              <Animated.View
                entering={messageFocusAnimationIn}
                exiting={messageFocusAnimationOut}
                style={messageStyles.messageWrapper(message.isMe)}
              >
                <MessageBubble message={message} />
              </Animated.View>
            )}
        <Animated.View
          entering={menuFocusAnimationIn}
          exiting={menuFocusAnimationOut}
          style={styles.menu(bluredBackdrop)}
        >
          {!bluredBackdrop && <BlurView tint='dark' style={styles.backdrop} intensity={128} />}
          {options.map((option, index) => (
            <Pressable
              onPress={() => {
                onSelect?.(option.action);
                closeMenu();
              }}
              style={styles.option}
              key={index}
            >
              <Icon size={28} color={option.color} icon={option.icon} />
              <Text style={styles.optionText(option.color)}>{option.label}</Text>
            </Pressable>
          ))}
        </Animated.View>
      </View>
    </Portal>
  );
}
