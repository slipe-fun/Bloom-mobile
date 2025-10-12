import { FadeIn, FadeOut, FadeInDown, FadeOutUp, withSpring, LinearTransition } from "react-native-reanimated";
import { fastSpring, normalSpring, quickSpring } from "./Easings";

export const getFadeOut = (i = 0) => {
  FadeOut.springify()
    .damping(normalSpring.damping)
    .mass(normalSpring.mass + i * 0.4)
    .stiffness(normalSpring.stiffness);
};

export const getFadeIn = (i = 0) => {
  FadeIn.springify()
    .damping(normalSpring.damping)
    .mass(normalSpring.mass + i * 0.4)
    .stiffness(normalSpring.stiffness);
};

export const getCharEnter = (i = 0) =>
  FadeInDown.springify()
    .damping(quickSpring.damping)
    .mass(quickSpring.mass + i * 0.2)
    .stiffness(quickSpring.stiffness);

export const getCharExit = (i = 0) =>
  FadeOutUp.springify()
    .damping(quickSpring.damping)
    .mass(quickSpring.mass + i * 0.2)
    .stiffness(quickSpring.stiffness);

export const layoutAnimation = LinearTransition.springify().mass(quickSpring.mass).damping(quickSpring.damping).stiffness(quickSpring.stiffness);

export const zoomAnimationOut = () => {
  "worklet";
  const animations = {
    opacity: withSpring(0, quickSpring),
    transform: [{ scale: withSpring(0.5, quickSpring) }],
  };
  const initialValues = {
    opacity: 1,
    transform: [{ scale: 1 }],
  };
  return {
    initialValues,
    animations,
  };
};

export const zoomAnimationIn = () => {
  "worklet";
  const animations = {
    opacity: withSpring(1, quickSpring),
    transform: [{ scale: withSpring(1, quickSpring) }],
  };
  const initialValues = {
    opacity: 0,
    transform: [{ scale: 0.5 }],
  };
  return {
    initialValues,
    animations,
  };
};
