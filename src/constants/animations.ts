// animations.ts
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



const springy = physicsSpring({ mass: quickSpring.mass, duration: 0.25, dampingRatio: 0.65 }) as SpringTriple;
const springyMessage = physicsSpring({ mass: quickSpring.mass, duration: 0.2, dampingRatio: 2.5 }) as SpringTriple;
const springyMenu = physicsSpring({ mass: quickSpring.mass, duration: 0.15, dampingRatio: 2.5 }) as SpringTriple;

export const layoutAnimationSpringy: ComplexAnimationBuilder = LinearTransition.springify()
  .mass(springy.mass)
  .damping(springy.damping)
  .stiffness(springy.stiffness);

export const layoutAnimation: ComplexAnimationBuilder = LinearTransition.springify()
  .mass(quickSpring.mass)
  .damping(quickSpring.damping)
  .stiffness(quickSpring.stiffness);



const makeSpringEntry =
  (Anim: { springify: () => ComplexAnimationBuilder }, massStep = 0.4) =>
  (i = 0): ComplexAnimationBuilder =>
    Anim.springify()
      .damping(quickSpring.damping)
      .mass(quickSpring.mass + i * massStep)
      .stiffness(quickSpring.stiffness);

export const getFadeOut = makeSpringEntry(FadeOut, 0.4);
export const getFadeIn = makeSpringEntry(FadeIn, 0.4);
export const getCharEnter = makeSpringEntry(FadeInDown, 0.2);
export const getCharExit = makeSpringEntry(FadeOutUp, 0.2);



export const zoomAnimationOut = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }] },
    animations: {
      opacity: withSpring(0, { mass: quickSpring.mass, stiffness: quickSpring.stiffness, damping: quickSpring.damping } ),
      transform: [{ scale: withSpring(0.5, { mass: quickSpring.mass, stiffness: quickSpring.stiffness, damping: quickSpring.damping } ) }],
    },
  };
};

export const zoomAnimationIn = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0.5 }] },
    animations: {
      opacity: withSpring(1, { mass: quickSpring.mass, stiffness: quickSpring.stiffness, damping: quickSpring.damping } ),
      transform: [{ scale: withSpring(1, { mass: quickSpring.mass, stiffness: quickSpring.stiffness, damping: quickSpring.damping } ) }],
    },
  };
};

export const messageFocusAnimationOut = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: { transform: [{ scale: 1.1 }] },
    animations: {
      transform: [{ scale: withSpring(1, { mass: springyMessage.mass, stiffness: springyMessage.stiffness, damping: springyMessage.damping } ) }],
    },
  };
};

export const messageFocusAnimationIn = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: { transform: [{ scale: 0.95 }] },
    animations: {
      transform: [{ scale: withSpring(1.1, { mass: springyMessage.mass, stiffness: springyMessage.stiffness, damping: springyMessage.damping } ) }],
    },
  };
};

export const menuFocusAnimationOut = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: {
      transform: [{ scale: 1 }, { translateY: 0 }],
      opacity: 1,
      borderRadius: 28,
    },
    animations: {
      transform: [
        { scale: withSpring(0.25, { mass: springyMenu.mass, stiffness: springyMenu.stiffness, damping: springyMenu.damping } ) },
        { translateY: withSpring(-64, { mass: springy.mass, stiffness: springy.stiffness, damping: springy.damping } ) },
      ],
      opacity: withSpring(0, { mass: springyMenu.mass, stiffness: springyMenu.stiffness, damping: springyMenu.damping } ),
      borderRadius: withSpring(20, { mass: springyMenu.mass, stiffness: springyMenu.stiffness, damping: springyMenu.damping } ),
    },
  };
};

export const menuFocusAnimationIn = (): LayoutAnimResult => {
  "worklet";
  return {
    initialValues: {
      transform: [{ scale: 0.25 }, { translateY: -64 }],
      opacity: 0,
      borderRadius: 20,
    },
    animations: {
      transform: [
        { scale: withSpring(1, { mass: springyMenu.mass, stiffness: springyMenu.stiffness, damping: springyMenu.damping } ) },
        { translateY: withSpring(0, { mass: springy.mass, stiffness: springy.stiffness, damping: springy.damping } ) },
      ],
      opacity: withSpring(1, { mass: springyMenu.mass, stiffness: springyMenu.stiffness, damping: springyMenu.damping } ),
      borderRadius: withSpring(28, { mass: springyMenu.mass, stiffness: springyMenu.stiffness, damping: springyMenu.damping } ),
    },
  };
};
