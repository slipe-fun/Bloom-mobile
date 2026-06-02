import { quickSpring } from '@constants/easings'
// import { staticColors } from '@design/colors'
// import { Platform } from 'react-native'
// import { interpolate } from 'react-native-reanimated'
// import { NAVIGATION_MASK_ELEMENT_STYLE_ID } from 'react-native-screen-transitions'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'

export const TOP_OFFSET = 4

export const zoomTransition = (): BlankStackNavigationOptions => {
  return {
    experimental_enableHighRefreshRate: true,
    gestureEnabled: true,
    gestureProgressMode: 'freeform',
    gestureDirection: ['horizontal', 'horizontal-inverted', 'pinch-in', 'vertical'],
    navigationMaskEnabled: true,
    screenStyleInterpolator: ({ active, bounds, insets }) => {
      'worklet'

      // const opacity = interpolate(progress, [0, 1, 2], [0, 0.25, 0], 'clamp')
      // const radius = !focused ? 0 : insets.top - TOP_OFFSET

      // const navigationStyles = bounds({
      //   id: 'avatar',
      // }).navigation.zoom({
      //   target: 'bound',
      //   borderRadius: radius,
      //   backgroundScale: 1,
      //   horizontalDragScale: [0.7, 1.3, 1.5],
      //   verticalDragScale: [0.7, 1.3, 1.5],
      //   horizontalDragTranslation: [1, 1, 0],
      //   verticalDragTranslation: [1, 1, 0],
      // })

      return bounds({ id: 'avatar' }).navigation.reveal({
        borderRadius: insets.top - TOP_OFFSET,
        borderContinuous: true,
        maxSensitivity: 0.8,
        velocityDepth: 0.5,
      })
    },
    transitionSpec: {
      open: quickSpring,
      close: quickSpring,
    },
  }
}
