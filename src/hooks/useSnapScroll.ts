import { Component } from "react";
import {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
  SharedValue,
} from "react-native-reanimated";

type Result<T> = {
  animatedRef: React.Ref<T>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  scrollY: SharedValue<number>;
};
 
export default function useSnapScroll<T extends Component>(snapTo: number = 56): Result<T> {
  const animatedRef = useAnimatedRef<T>();
  const scrollY = useSharedValue(0);

  const snap = (target: number) => {
    "worklet";
    scrollTo(animatedRef, 0, target, true);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.set(e.contentOffset.y);
    },
    onEndDrag: (e) => {
      const y = e.contentOffset.y;
      const v = e.velocity?.y ?? 0;

      if (y <= 0 || y >= snapTo) return;

      if (Math.abs(v) > 0) return;

      snap(y > snapTo / 2 ? snapTo : 0);
    },
    onMomentumEnd: (e) => {
      const y = e.contentOffset.y;

      if (y > 0 && y < snapTo) {
        snap(y > snapTo / 2 ? snapTo : 0);
      }
    },
  });

  return {
    animatedRef,
    scrollHandler,
    scrollY,
  };
}
