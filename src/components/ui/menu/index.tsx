import React, { useCallback, useRef, useState } from "react";
import { View, Pressable, Text } from "react-native";
import { Portal } from "@gorhom/portal";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { normalSpring, quickSpring } from "@constants/Easings";
import { Haptics } from "react-native-nitro-haptics";
import { BlurView } from "expo-blur";
import { styles } from "./Menu.styles";

type Position = { top: number; left: number; width: number };

type MenuProps = {
  trigger: React.ReactNode;
  options?: object;
  onSelect?: (value?: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Menu({ trigger, options, onSelect, onOpen, onClose }: MenuProps): React.ReactNode {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<any>(null);

  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (open) return close();

    triggerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      setPosition({ top: y, left: x + width, width });
      setOpen(true);
      Haptics.impact("medium");
      onOpen?.();
    });
  }, [open, close, onOpen]);

  const animatedViewStyles = useAnimatedStyle(() => ({
    opacity: withSpring(open ? 1 : 0, normalSpring),
    borderRadius: withSpring(open ? 28 : 20, normalSpring),
    transform: [{ scale: withSpring(open ? 1 : 0, quickSpring) }],
  }));

  const animatedPressableStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(open ? 0.8 : 1, quickSpring) }],
    opacity: withSpring(open ? 0 : 1, quickSpring),
  }));

  return (
    <>
      <AnimatedPressable delayLongPress={400} onLongPress={toggle} style={animatedPressableStyles} ref={triggerRef}>
        {trigger}
      </AnimatedPressable>

      <Portal>
        {open && <Pressable style={styles.backdrop} onPress={close} />}

        <View style={styles.menuWrapper({ top: position.top, open })}>
          <Animated.View style={[styles.menu, animatedViewStyles]}>
            <BlurView tint="dark" style={styles.backdrop} intensity={128} />
            <Text>Swag</Text>
          </Animated.View>
        </View>
      </Portal>
    </>
  );
}
