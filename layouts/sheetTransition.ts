import { quickSpring } from '@constants/easings'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'

export const screenTransition = (gestures: boolean = true): BlankStackNavigationOptions => {
  const color = UnistylesRuntime.getTheme().colors.background
  const sheetRadius = 38

  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: gestures,
    gestureDirection: ['vertical'],
    screenStyleInterpolator: ({ layouts: { screen }, progress, next, insets }) => {
      'worklet'

      const sheetHeight = screen.height / (screen.height / insets.top / 1.5)

      const translateY = interpolate(progress, [1, 2], [sheetHeight, 0], 'clamp')

      return {
        contentStyle: {
          transform: [{ translateY }],
          overflow: 'hidden',
          height: sheetHeight,
          borderTopLeftRadius: sheetRadius,
          borderTopRightRadius: sheetRadius,
          borderCurve: 'continuous',
          backgroundColor: color,
        },
        overlayStyle: {
          opacity: 0,
        },
      }
    },
    transitionSpec: {
      open: quickSpring,
      close: quickSpring,
    },
  }
}
