import MaskedView from '@react-native-masked-view/masked-view'
import { type BlurTint, BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import type React from 'react'
import { type ComponentProps, useMemo } from 'react'
import { Easing, type StyleProp, type View, type ViewStyle } from 'react-native'
import { easeGradient } from 'react-native-easing-gradient'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

type GradientDirection = 'top-to-bottom' | 'bottom-to-top' | 'bottom-left-to-top-right'

interface GradientBlurProps extends ComponentProps<typeof View> {
  direction?: GradientDirection
  ref?: React.Ref<MaskedView>
  style?: StyleProp<ViewStyle>
  gray?: boolean
  behindKeyboard?: boolean
  blur?: boolean
}

const DIRECTIONS: Record<GradientDirection, { start: { x: number; y: number }; end: { x: number; y: number } }> = {
  'top-to-bottom': { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } },
  'bottom-left-to-top-right': { start: { x: 0.5, y: 0 }, end: { x: 1, y: 1 } },
  'bottom-to-top': { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
}

export default function GradientBlur({
  direction = 'bottom-to-top',
  ref,
  style,
  gray,
  behindKeyboard,
  blur = true,
  ...props
}: GradientBlurProps) {
  const { theme, rt } = useUnistyles()

  const isDark = rt.themeName.includes('dark')
  const tint: BlurTint = isDark ? 'systemChromeMaterialDark' : gray ? 'light' : 'systemChromeMaterialLight'

  const { mask, grad } = useMemo(() => {
    const c = theme.colors
    const [cEnd, cStart] = gray ? [c.grayGradientBlurEnd, c.grayGradientBlurStart] : [c.gradientBlurEnd, c.gradientBlurStart]

    const easing = Easing.bezier(0.42, 0, 0.58, 1)
    const extraColorStopsPerTransition = 20

    return {
      mask: easeGradient({
        colorStops: {
          0: { color: '#00000000' },
          0.4: { color: '#000000' },
        },
        easing,
        extraColorStopsPerTransition,
      }),
      grad: easeGradient({
        colorStops: {
          0: { color: cEnd },
          [behindKeyboard ? 0.2 : 0.85]: { color: cStart },
        },
        easing,
        extraColorStopsPerTransition,
      }),
    }
  }, [theme, gray, behindKeyboard])

  const gradientStyles = [StyleSheet.absoluteFill, style]

  const { start, end } = DIRECTIONS[direction]

  return (
    <>
      {blur && (
        <MaskedView
          ref={ref}
          pointerEvents="none"
          style={gradientStyles}
          {...props}
          maskElement={
            <LinearGradient
              start={start}
              end={end}
              locations={mask.locations as any}
              colors={mask.colors as any}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <BlurView style={StyleSheet.absoluteFill} intensity={10} tint={tint} />
        </MaskedView>
      )}

      <LinearGradient
        pointerEvents="none"
        start={start}
        end={end}
        {...props}
        locations={grad.locations as any}
        colors={grad.colors as any}
        style={gradientStyles}
      />
    </>
  )
}
