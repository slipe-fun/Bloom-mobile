import { useSharedValue, useAnimatedScrollHandler, runOnJS } from "react-native-reanimated";
import { useRef } from "react";

export function useSnapScroll(snapTo = 56, velocityThreshold = 50) {
  const scrollY = useSharedValue(0);
  const listRef = useRef(null);

  const doSnap = (offsetY, velocity) => {
    if (offsetY > snapTo) return;

    let target;
    if (Math.abs(velocity) > velocityThreshold) {
      target = velocity > 0 ? snapTo : 0;
    } else {
      target = offsetY < snapTo / 2 ? 0 : snapTo;
    }
    listRef.current?.scrollToOffset({ offset: target, animated: true });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onEndDrag: (event) => {
      const offsetY = event.contentOffset.y;
      const velocity = event.velocity?.y ?? 0;
      runOnJS(doSnap)(offsetY, velocity);
    },
  });

  return { listRef, scrollHandler, scrollY };
}
