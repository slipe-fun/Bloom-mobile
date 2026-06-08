import { staticColors } from '@design/colors'
import { interpolate } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'

export const TOP_OFFSET = 7

export const screenTransition = (gestures: boolean = true): BlankStackNavigationOptions => {
  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: gestures,
    gestureDirection: ['horizontal'],
    screenStyleInterpolator: ({
      current: {
        layouts: { screen },
      },
      progress,
      active,
      insets,
    }) => {
      'worklet'

      const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width / 3], 'clamp')
      const opacity = interpolate(progress, [0, 1, 2], [0, 0.3, 0], 'clamp')

      return {
        content: {
          style: {
            transform: [{ translateX }],
            borderRadius: active.settled ? 0 : insets.top - TOP_OFFSET,
            borderCurve: 'continuous',
            overflow: 'hidden',
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
