import React from "react";
import { View, Pressable, Text } from "react-native";
import { Portal } from "@gorhom/portal";
import Animated from "react-native-reanimated";
import { BlurView } from "expo-blur";
import Icon from "../Icon";
import { styles } from "./Menu.styles";
import { getFadeIn, getFadeOut, getMenuOptionEnter, getMenuOptionExit, menuFocusAnimationIn, menuFocusAnimationOut, messageFocusAnimationIn, messageFocusAnimationOut } from "@constants/animations";
import type { MessageInterface, Option } from "@interfaces";
import MessageBubble from "@components/chatScreen/message/MessageBubble";
import { styles as messageStyles } from "@components/chatScreen/message/Message.styles";

type MenuProps = {
  isOpen: boolean;
  position: { top: number; left: number; width: number };
  closeMenu: () => void;
  options: Option[];
  message?: MessageInterface;
  bluredBackdrop?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Menu({ isOpen, position, closeMenu, options, message, bluredBackdrop }: MenuProps) {
  if (!isOpen) return null;

  return (
    <Portal>
        <AnimatedPressable entering={getFadeIn()} exiting={getFadeOut()} onPress={closeMenu} style={styles.backdrop}>
          {bluredBackdrop && <BlurView style={styles.backdrop} intensity={48} tint='dark' />}
        </AnimatedPressable>

      <View style={styles.menuWrapper({ top: position.top })}>
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
          {options.map((option, index) => !option.separator ? (
            <AnimatedPressable
              exiting={getMenuOptionExit(index)}
              entering={getMenuOptionEnter(index)}
              onPress={() => {
                option.action?.();
                closeMenu();
              }}
              style={styles.option}
              key={index}
            >
              <Icon size={28} color={option.color} icon={option.icon} />
              <Text style={styles.optionText(option.color)}>{option.label}</Text>
            </AnimatedPressable>
          ) : (
            <Animated.View  exiting={getMenuOptionExit(index)}
              entering={getMenuOptionEnter(index)} style={styles.separator} key={index}/>
          ))}
        </Animated.View>
      </View>
    </Portal>
  );
}
