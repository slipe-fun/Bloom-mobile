import { staticColors } from '@design/colors'
import { interpolate } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'
import { TOP_OFFSET } from './transition'

export const settingsTransition = (): BlankStackNavigationOptions => {
  const color = UnistylesRuntime.getTheme().colors.background

  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: true,
    gestureDirection: ['vertical'],
    screenStyleInterpolator: ({
      current: {
        layouts: { screen },
      },
      progress,
      active,
      insets,
    }) => {
      'worklet'

      const translateY = interpolate(progress, [0, 1, 2], [screen.height, 0, -screen.height / 3], 'clamp')
      const opacity = interpolate(progress, [0, 1, 2], [0, 0.3, 0], 'clamp')

      return {
        content: {
          style: {
            transform: [{ translateY }],
            overflow: 'hidden',
            borderRadius: active.settled ? 0 : insets.top - TOP_OFFSET,
            borderCurve: 'continuous',
            backgroundColor: color,
          },
        },
        backdrop: {
          style: {
            opacity,
            backgroundColor: staticColors.black,
          },
        },
      }
    },
    transitionSpec: {
      open: Transition.Specs.DefaultSpec,
      close: Transition.Specs.DefaultSpec,
    },
  }
}
