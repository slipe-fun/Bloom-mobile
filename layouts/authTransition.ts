import { quickSpring } from '@constants/easings'
import { staticColors } from '@design/colors'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'

export const TOP_OFFSET = 4

export const authScreenTransition = (): BlankStackNavigationOptions => {
  const color = UnistylesRuntime.getTheme().colors.background

  return {
    // experimental_enableHighRefreshRate: true,
    gestureEnabled: true,
    gestureDirection: ['horizontal'],
    screenStyleInterpolator: ({
      current: {
        layouts: { screen },
      },
      progress,
    }) => {
      'worklet'

      const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width], 'clamp')
      const opacity = interpolate(progress, [0, 1, 2], [0, 1, 0], 'clamp')

      return {
        content: {
          style: {
            transform: [{ translateX }],
            overflow: 'hidden',
            borderRadius: 0,
            borderCurve: 'continuous',
            backgroundColor: color,
          },
        },
        backdrop: {
          style: {
            opacity,
            backgroundColor: color,
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
