import { quickSpring } from '@constants/easings'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'

export const authScreenTransition = (): BlankStackNavigationOptions => {
  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: false,
    gestureDirection: ['horizontal'],
    screenStyleInterpolator: ({
      current: {
        layouts: { screen },
      },
      progress,
    }) => {
      'worklet'

      const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width], 'clamp')

      return {
        content: {
          style: {
            transform: [{ translateX }],
            overflow: 'hidden',
          },
        },
        backdrop: {
          style: {
            opacity: 0,
          },
        },
      }
    },
    transitionSpec: {
      open: quickSpring,
      close: quickSpring,
    },
  }
}
