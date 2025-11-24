import {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutUp,
  withSpring,
  LinearTransition,
  type ComplexAnimationBuilder,
} from "react-native-reanimated";

import { quickSpring } from "./easings";
import physicsSpring from "@lib/physicSpring";

type SpringTriple = { mass: number; stiffness: number; damping: number };

export type LayoutAnimResult = {
  initialValues: Record<string, any>;
  animations: Record<string, any>;
};



export const springy = physicsSpring({ mass: quickSpring.mass, duration: 0.25, dampingRatio: 0.65 }) as SpringTriple;
export const springyMessage = physicsSpring({ mass: quickSpring.mass, duration: 0.2, dampingRatio: 2.5 }) as SpringTriple;
export const springyMenu = physicsSpring({ mass: quickSpring.mass, duration: 0.15, dampingRatio: 2.5 }) as SpringTriple;
export const springyChar = (i: number = 0) => physicsSpring({ mass: quickSpring.mass, duration: 0.35 + i * 0.07, dampingRatio: 0.65 }) as SpringTriple;
export const springyTabBar = physicsSpring({ mass: quickSpring.mass, duration: 0.2, dampingRatio: 0.8 }) as SpringTriple;

export const layoutAnimationSpringy: ComplexAnimationBuilder = LinearTransition.springify()
  .mass(springy.mass)
  .damping(springy.damping)
  .stiffness(springy.stiffness);

export const layoutAnimation: ComplexAnimationBuilder = LinearTransition.springify()
  .mass(quickSpring.mass)
  .damping(quickSpring.damping)
  .stiffness(quickSpring.stiffness);



const makeSpringEntry =
  (Anim: { springify: () => ComplexAnimationBuilder }) =>
  (easing = quickSpring): ComplexAnimationBuilder =>
    Anim.springify()
      .damping(easing.damping)
      .mass(easing.mass)
      .stiffness(easing.stiffness);

export const getFadeOut = makeSpringEntry(FadeOut);
export const getFadeIn = makeSpringEntry(FadeIn);
export const getCharEnter = makeSpringEntry(FadeInDown);
export const getCharExit = makeSpringEntry(FadeOutUp);


export const zoomAnimationOut = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }] },
    animations: {
      opacity: withSpring(0, quickSpring),
      transform: [{ scale: withSpring(0.5, quickSpring) }],
    },
  };
};

export const zoomAnimationIn = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0.5 }] },
    animations: {
      opacity: withSpring(1, quickSpring),
      transform: [{ scale: withSpring(1, quickSpring) }],
    },
  };
};

export const messageFocusAnimationOut = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: { transform: [{ scale: 1.1 }]},
    animations: {
      transform: [{ scale: withSpring(1, springyMessage ) }],
    },
  };
};

export const messageFocusAnimationIn = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: { transform: [{ scale: 0.95 }]},
    animations: {
      transform: [{ scale: withSpring(1.1, springyMessage ) }],
    },
  };
};
