import { quickSpring } from '@constants/easings'
import { interpolate } from 'react-native-reanimated'

export const screenTransition = (gestures = true) =>
  ({
    enableTransitions: true,
    gestureEnabled: gestures,
    gestureDirection: ['horizontal'],
    screenStyleInterpolator: ({ layouts: { screen }, progress, focused }) => {
      'worklet'

      const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width], 'clamp')
      const opacity = interpolate(progress, [0, 1, 2], [0, 1, 0], 'clamp')

      return {
        contentStyle: {
          transform: [{ translateX }],
          overflow: 'hidden',
          opacity: opacity,
        },
      }
    },
    transitionSpec: {
      open: quickSpring,
      close: quickSpring,
    },
  }) as any
