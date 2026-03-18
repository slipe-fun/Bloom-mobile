import { quickSpring } from '@constants/easings'
import { staticColors } from '@design/colors'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'
import { TOP_OFFSET } from './transition'

export const SHEET_RADIUS = 38

export const sheetTransition = (gestures: boolean = true): BlankStackNavigationOptions => {
  const backgroundColor = UnistylesRuntime.getTheme().colors.background

  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: gestures,
    gestureDirection: ['vertical'],
    screenStyleInterpolator: ({ layouts: { screen }, progress, previous, insets, active }) => {
      'worklet'

      const sheetHeight = screen.height * 0.925

      const translateY = interpolate(progress, [0, 1], [screen.height, screen.height - sheetHeight], 'clamp')
      const scale = interpolate(progress, [1, 2], [1, 0.875], 'clamp')
      const opacity = interpolate(progress, [0, 1, 2], [0, 0.5, 0], 'clamp')

      const radius = active.progress === 0 ? 0 : previous ? SHEET_RADIUS : insets.top - TOP_OFFSET
      const transform = [{ scale }]
      // @ts-expect-error
      if (previous) transform.unshift({ translateY })

      return {
        contentStyle: {
          transform,
          overflow: 'hidden',
          borderRadius: radius,
          borderCurve: 'continuous',
          backgroundColor,
          paddingBottom: previous ? screen.height - sheetHeight : 0,
        },
        overlayStyle: {
          opacity,
          backgroundColor: staticColors.black,
        },
      }
    },
    transitionSpec: {
      open: quickSpring,
      close: quickSpring,
    },
  }
}
