import { quickSpring } from '@constants/easings'
import { Platform } from 'react-native'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'

const TOP_OFFSET = Platform.OS === 'ios' ? 12 : 16

export const screenTransition = (gestures: boolean = true): BlankStackNavigationOptions => {
  const color = UnistylesRuntime.getTheme().colors.background

  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: gestures,
    gestureDirection: ['horizontal'],
    screenStyleInterpolator: ({ layouts: { screen }, progress, insets }) => {
      'worklet'

      const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width / 3.5], 'clamp')
      const opacity = interpolate(progress, [1, 2], [1, 0.5], 'clamp')
      const borderRadius = interpolate(progress, [0.965, 1, 1.035], [insets.top, insets.top - TOP_OFFSET, 0], 'clamp')
      return {
        contentStyle: {
          transform: [{ translateX }],
          overflow: 'hidden',
          opacity,
          borderRadius,
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
