import { quickSpring } from '@constants/easings'
import { Platform } from 'react-native'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'

export const screenTransition = (gestures: boolean = true): BlankStackNavigationOptions => {
  const color = UnistylesRuntime.getTheme().colors.background
  const iOS = Platform.OS === 'ios'

  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: gestures,
    gestureDirection: ['horizontal'],
    screenStyleInterpolator: ({ layouts: { screen }, progress, next, insets }) => {
      'worklet'

      if (next?.meta?.scalesOthers) {
        const scale = interpolate(progress, [1, 2], [1, screen.height / (screen.height + insets.top)], 'clamp')
        const borderRadius = iOS
          ? interpolate(progress, [1, 2], [insets.top - 12, insets.top], 'clamp')
          : interpolate(progress, [1, 2], [insets.top - 16, insets.top * 2.5], 'clamp')

        return {
          contentStyle: {
            transform: [{ scale }],
            overflow: 'hidden',
            borderRadius,
            borderCurve: 'continuous',
            backgroundColor: color,
          },
          overlayStyle: {
            opacity: 0,
          },
        }
      } else {
        const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width / 3.5], 'clamp')
        const borderRadius = iOS
          ? interpolate(progress, [0.95, 1, 1.05], [insets.top, insets.top - 12, insets.top], 'clamp')
          : interpolate(progress, [0.95, 1, 1.05], [insets.top * 2.5, insets.top - 16, insets.top * 2.5], 'clamp')

        return {
          contentStyle: {
            transform: [{ translateX }],
            overflow: 'hidden',
            borderRadius,
            borderCurve: 'continuous',
            backgroundColor: color,
          },
          overlayStyle: {
            opacity: 0,
          },
        }
      }
    },
    transitionSpec: {
      open: quickSpring,
      close: quickSpring,
    },
  }
}
