import { quickSpring } from '@constants/easings'
import { staticColors } from '@design/colors'
import { interpolate } from 'react-native-reanimated'
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/blank-stack'
import { UnistylesRuntime } from 'react-native-unistyles'

export const TOP_OFFSET = 4

export const zoomTransition = (): BlankStackNavigationOptions => {
  const color = UnistylesRuntime.getTheme().colors.background

  return {
    // experimental_enableHighRefreshRate: true,
    gestureEnabled: true,
    gestureDirection: 'bidirectional',
    screenStyleInterpolator: ({ bounds }) => {
      'worklet'

      return bounds({ id: 'avatar' }).navigation.zoom({
        target: 'fullscreen',
        debug: true,
      })
    },
    transitionSpec: {
      open: quickSpring,
      close: quickSpring,
    },
  }
}
