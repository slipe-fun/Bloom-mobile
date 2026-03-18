import { quickSpring } from '@constants/easings'
import { staticColors } from '@design/colors'
import { Platform } from 'react-native'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'

export const TOP_OFFSET = Platform.OS === 'ios' ? 5 : 9

export const screenTransition = (gestures: boolean = true): BlankStackNavigationOptions => {
  const color = UnistylesRuntime.getTheme().colors.background

  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: gestures,
    gestureDirection: ['horizontal'],
    screenStyleInterpolator: ({ layouts: { screen }, progress, insets, active }) => {
      'worklet'

      const translateX = interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width / 3.5], 'clamp')
      const opacity = interpolate(progress, [0, 1, 2], [0, 0.2, 0], 'clamp')
      const radius = active.progress === 1 ? 0 : insets.top - TOP_OFFSET

      return {
        contentStyle: {
          transform: [{ translateX }],
          overflow: 'hidden',
          borderRadius: radius,
          borderCurve: 'continuous',
          backgroundColor: color,
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
