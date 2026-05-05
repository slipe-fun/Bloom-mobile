import { quickSpring } from '@constants/easings'
import { staticColors } from '@design/colors'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'

export const TOP_OFFSET = 4

export const screenTransition = (gestures: boolean = true): BlankStackNavigationOptions => {
  const color = UnistylesRuntime.getTheme().colors.background

  return {
    // experimental_enableHighRefreshRate: true,
    gestureEnabled: gestures,
    gestureDirection: ['horizontal'],
    screenStyleInterpolator: ({
      current: {
        layouts: { screen },
      },
      progress,
      focused,
      insets,
    }) => {
      'worklet'

      const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width / 3.5], 'clamp')
      const opacity = interpolate(progress, [0, 1, 2], [0, 0.3, 0], 'clamp')
      const radius = !focused ? 0 : insets.top - TOP_OFFSET

      return {
        content: {
          style: {
            transform: [{ translateX }],
            overflow: 'hidden',
            borderRadius: radius,
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
      open: quickSpring,
      close: quickSpring,
    },
  }
}
