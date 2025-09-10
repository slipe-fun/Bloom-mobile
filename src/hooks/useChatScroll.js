import { useSharedValue, interpolate, useAnimatedScrollHandler } from "react-native-reanimated";
import { useRef } from "react";

export function useChatScroll() {
  const scrollY = useSharedValue(0);
  const listRef = useRef(null);

  const getCloser = (value, checkOne, checkTwo) =>
    Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;

  const onEndDrag = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const clampedY = Math.min(Math.max(scrollY.value, 0), 56);
    const translateY = interpolate(clampedY, [0, 56], [0, -56], "clamp");

    if (!(translateY === 0 || translateY === -56)) {
      if (listRef.current) {
        const snapTo = getCloser(translateY, -56, 0) === -56 ? offsetY + 56 : offsetY - 56;

        listRef.current.scrollToOffset({
          offset: offsetY - snapTo,
          animated: true,
        });
      }
    }
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return { scrollY, listRef, onEndDrag, onScroll };
}
