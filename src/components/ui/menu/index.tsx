import React from "react";
import { View, Pressable, Text } from "react-native";
import { Portal } from "@gorhom/portal";
import Animated from "react-native-reanimated";
import { BlurView } from "expo-blur";
import Icon from "../Icon";
import { styles } from "./Menu.styles";
import { getFadeIn, getFadeOut } from "@constants/animations";
import type { Option } from "@interfaces";

type MenuProps = {
  isOpen: boolean;
  position: { top: number; left: number; width: number };
  closeMenu: () => void;
  options: Option[];
  bluredBackdrop?: boolean;
  right?: boolean
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Menu({ isOpen, position, closeMenu, options, bluredBackdrop, right = true }: MenuProps): React.JSX.Element {
  if (!isOpen) return null;

  return (
    <Portal>
        <AnimatedPressable entering={getFadeIn()} exiting={getFadeOut()} onPress={closeMenu} style={styles.backdrop}>
          {bluredBackdrop && <BlurView style={styles.backdrop} intensity={48} tint='dark' />}
        </AnimatedPressable>

      <View style={styles.menuWrapper(position.top)}>
        <Animated.View
          style={styles.menu(bluredBackdrop, right)}
        >
          {!bluredBackdrop && <BlurView tint='dark' style={styles.backdrop} intensity={128} />}
          {options.map((option, index) => !option.separator ? (
            <AnimatedPressable
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
            <Animated.View 
               style={styles.separator} key={index}/>
          ))}
        </Animated.View>
      </View>
    </Portal>
  );
}
