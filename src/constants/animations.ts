import physicsSpring from '@lib/physicSpring'
import { type ComplexAnimationBuilder, FadeIn, FadeInDown, FadeOut, FadeOutUp, LinearTransition, withSpring } from 'react-native-reanimated'
import { quickSpring } from './easings'

type SpringTriple = { mass: number; stiffness: number; damping: number }

export type LayoutAnimResult = {
  initialValues: Record<string, any>
  animations: Record<string, any>
}

export * from './easings'
export const springy = physicsSpring({
  mass: quickSpring.mass,
  duration: 0.25,
  dampingRatio: 0.65,
}) as SpringTriple

export const springyMessage = physicsSpring({
  mass: quickSpring.mass,
  duration: 0.2,
  dampingRatio: 2.5,
}) as SpringTriple

export const springyMenu = physicsSpring({
  mass: quickSpring.mass,
  duration: 0.15,
  dampingRatio: 2.5,
}) as SpringTriple

export const springyChar = (i: number = 0) =>
  physicsSpring({ mass: quickSpring.mass, duration: 0.35 + i * 0.07, dampingRatio: 0.65 }) as SpringTriple

export const springyTabBar = physicsSpring({
  mass: quickSpring.mass,
  duration: 0.2,
  dampingRatio: 0.8,
}) as SpringTriple

export const layoutAnimationSpringy: ComplexAnimationBuilder = LinearTransition.springify()
  .mass(springy.mass)
  .damping(springy.damping)
  .stiffness(springy.stiffness)

export const layoutAnimation: ComplexAnimationBuilder = LinearTransition.springify()
  .mass(quickSpring.mass)
  .damping(quickSpring.damping)
  .stiffness(quickSpring.stiffness)

export const makeLayoutAnimation = (easing: SpringTriple = quickSpring): ComplexAnimationBuilder =>
  LinearTransition.springify().damping(easing.damping).mass(easing.mass).stiffness(easing.stiffness)

const makeSpringEntry =
  (Anim: { springify: () => ComplexAnimationBuilder }) =>
  (easing: SpringTriple = quickSpring): ComplexAnimationBuilder =>
    Anim.springify().damping(easing.damping).mass(easing.mass).stiffness(easing.stiffness)

export const getFadeOut = makeSpringEntry(FadeOut)
export const getFadeIn = makeSpringEntry(FadeIn)
export const getCharEnter = makeSpringEntry(FadeInDown)
export const getCharExit = makeSpringEntry(FadeOutUp)

export const zoomAnimationOut = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }] },
    animations: {
      opacity: withSpring(0, quickSpring),
      transform: [{ scale: withSpring(0.5, quickSpring) }],
    },
  }
}

export const zoomAnimationIn = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0.5 }] },
    animations: {
      opacity: withSpring(1, quickSpring),
      transform: [{ scale: withSpring(1, quickSpring) }],
    },
  }
}

export const reversedZoomAnimationIn = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { opacity: 0, transform: [{ scale: 1.25 }] },
    animations: {
      opacity: withSpring(1, quickSpring),
      transform: [{ scale: withSpring(1, quickSpring) }],
    },
  }
}

export const messageFocusAnimationOut = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { transform: [{ scale: 1.1 }] },
    animations: {
      transform: [{ scale: withSpring(1, springyMessage) }],
    },
  }
}

export const messageFocusAnimationIn = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { transform: [{ scale: 0.95 }] },
    animations: {
      transform: [{ scale: withSpring(1.1, springyMessage) }],
    },
  }
}

export const paperplaneAnimationOut = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { transform: [{ translateX: 0 }, { translateY: 0 }], opacity: 1 },
    animations: {
      transform: [{ translateX: withSpring(26, quickSpring) }, { translateY: withSpring(-26, quickSpring) }],
      opacity: withSpring(0, quickSpring),
    },
  }
}

export const paperplaneAnimationIn = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { transform: [{ translateX: -26 }, { translateY: 26 }], opacity: 0 },
    animations: {
      transform: [{ translateX: withSpring(0, quickSpring) }, { translateY: withSpring(0, quickSpring) }],
      opacity: withSpring(1, quickSpring),
    },
  }
}

export const charAnimationOut = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }, { translateY: '0%' }] },
    animations: {
      opacity: withSpring(0, quickSpring),
      transform: [{ scale: withSpring(0.5, quickSpring) }, { translateY: withSpring('100%', quickSpring) }],
    },
  }
}

export const charAnimationIn = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0.5 }, { translateY: '-100%' }] },
    animations: {
      opacity: withSpring(1, quickSpring),
      transform: [{ scale: withSpring(1, quickSpring) }, { translateY: withSpring('0%', quickSpring) }],
    },
  }
}

export const vSlideAnimationOut = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { opacity: 1, transform: [{ translateY: '0%' }] },
    animations: {
      opacity: withSpring(0, quickSpring),
      transform: [{ translateY: withSpring('100%', quickSpring) }],
    },
  }
}

export const vSlideAnimationIn = (): LayoutAnimResult => {
  'worklet'
  return {
    initialValues: { opacity: 0, transform: [{ translateY: '-100%' }] },
    animations: {
      opacity: withSpring(1, quickSpring),
      transform: [{ translateY: withSpring('0%', quickSpring) }],
    },
  }
}
