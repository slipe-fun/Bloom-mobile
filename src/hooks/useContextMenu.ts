import { useCallback, useRef, useState } from "react";
import { Haptics } from "react-native-nitro-haptics";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";
import type { Position } from "@interfaces";
import { quickSpring } from "@constants/easings";
import useContextMenuStore from "src/stores/contextMenu";

interface UseContextMenuProps {
  onOpen?: () => void;
  onClose?: () => void;
  hapticFeedback?: boolean;
  scaleBackground?: boolean;
}

export default function useContextMenu({
  onOpen,
  onClose,
  hapticFeedback = true,
  scaleBackground = false,
}: UseContextMenuProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Position>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<any>(null);
  const { setFocused } = useContextMenuStore();

  const openMenu = useCallback(() => {
    triggerRef.current?.measureInWindow?.((x: number, y: number, width: number) => {
      setMenuPosition({ top: y, left: x + width, width });
      setIsOpen(true);
      scaleBackground && setFocused(true);
      hapticFeedback && Haptics.impact("medium");
      onOpen?.();
    });
  }, [hapticFeedback, onOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    scaleBackground && setFocused(false);
    onClose?.();
  }, [onClose]);

  const triggerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isOpen ? 0.8 : 1, quickSpring) }],
      opacity: withSpring(isOpen ? 0 : 1, quickSpring),
    };
  }, [isOpen]);

  const triggerProps = {
    ref: triggerRef,
    onLongPress: openMenu,
    delayLongPress: 300,
  };

  return {
    isOpen,
    openMenu,
    closeMenu,
    menuPosition,
    triggerRef,
    triggerProps,
    triggerAnimatedStyle,
  };
}
