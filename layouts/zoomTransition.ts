import Transition from 'react-native-screen-transitions'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'

export const TOP_OFFSET = 4

export const zoomTransition = (): BlankStackNavigationOptions => {
  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: true,
    gestureProgressMode: 'freeform',
    gestureDirection: ['horizontal', 'horizontal-inverted', 'pinch-in', 'vertical'],
    navigationMaskEnabled: true,
    screenStyleInterpolator: ({ bounds, insets, focused }) => {
      'worklet'

      const styles = bounds({ id: 'avatar' }).navigation.reveal({
        borderRadius: insets.top - TOP_OFFSET,
        borderContinuous: true,
        maxSensitivity: 0.6,
        velocityDepth: 0.5,
      })

      // @ts-expect-error
      if (!focused && styles?.content?.style) {
        // @ts-expect-error
        styles.content.style.transform = [{ scale: 1 }]
      }

      // @ts-expect-error
      if (styles?.avatar?.style) {
        // @ts-expect-error
        styles.avatar.style.position = undefined
      }

      return styles
    },
    transitionSpec: {
      open: Transition.Specs.DefaultSpec,
      close: Transition.Specs.DefaultSpec,
    },
  }
}
